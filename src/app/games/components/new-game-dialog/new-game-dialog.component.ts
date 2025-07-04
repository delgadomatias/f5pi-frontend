import { CurrencyPipe, formatDate } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionSelectionChange } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { AlertComponent } from '@common/components/alert/alert.component';
import { GenericDialogComponent } from '@common/components/generic-dialog/generic-dialog.component';
import { ClientStorageService } from '@common/services/client-storage.service.abstract';
import { EntityDialogService } from '@common/services/entity-dialog.service';
import { NewFieldDialogComponent } from '@fields/components/new-field-dialog/new-field-dialog.component';
import { injectGetInfiniteFieldsQuery } from '@fields/queries/inject-get-infinite-fields';
import { CreateGameDetailRequest } from '@games/interfaces/create-game-detail-request.interface';
import { CreateGameRequest } from '@games/interfaces/create-game-request.interface';
import { CreateGameService } from '@games/services/create-game.service';
import { NewPlayerDialogComponent } from '@players/components/new-player-dialog/new-player-dialog.component';
import { Player } from '@players/interfaces/responses/player.interface';
import { injectGetInfinitePlayersQuery } from '@players/queries/inject-get-infinite-players-query';
import { NewSeasonDialogComponent } from '@seasons/components/new-season-dialog/new-season-dialog.component';
import { injectGetInfiniteSeasonsQuery } from '@seasons/queries/inject-get-infinite-seasons-query';

enum Team {
  FIRST = 'first',
  SECOND = 'second',
}

interface MemberControl {
  player: FormControl<Player>;
  goalsScored: FormControl<number>;
  ownGoals: FormControl<number>;
}

interface GameForm {
  date: Date;
  fieldId: string;
  individualPrice: string;
  seasonId: string;
  playersForFirstTeam: Player[];
  detailsOfEachPlayerOfFirstTeam: MemberControl[];
  playersForSecondTeam: Player[];
  detailsOfEachPlayerOfSecondTeam: MemberControl[];
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    GenericDialogComponent,
    MatButtonModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  selector: 'f5pi-new-game-dialog',
  styleUrl: './new-game-dialog.component.scss',
  templateUrl: './new-game-dialog.component.html',
  providers: [CurrencyPipe, CreateGameService],
})
export class NewGameDialogComponent implements OnInit {
  clientStorage = inject(ClientStorageService);
  currencyPipe = inject(CurrencyPipe);
  dialogRef = inject(MatDialogRef);
  entityDialogService = inject(EntityDialogService);
  formBuilder = inject(NonNullableFormBuilder);
  createGameService = inject(CreateGameService);
  getInfiniteFieldsQuery = injectGetInfiniteFieldsQuery();
  getInfinitePlayersQuery = injectGetInfinitePlayersQuery();
  getInfiniteSeasonsQuery = injectGetInfiniteSeasonsQuery();

  form = this.formBuilder.group(
    {
      date: [new Date(), [Validators.required]],
      individualPrice: ['', [Validators.required]],
      fieldId: ['', [Validators.required]],
      seasonId: ['', [Validators.required]],
      playersForFirstTeam: [[] as Player[], [Validators.required]],
      detailsOfEachPlayerOfFirstTeam: this.formBuilder.array<MemberControl>([]),
      playersForSecondTeam: [[] as Player[], [Validators.required]],
      detailsOfEachPlayerOfSecondTeam: this.formBuilder.array<MemberControl>([]),
    },
    {
      validators: [teamsHaveSameLengthValidator()],
    }
  );

  syncState = effect(() => {
    const fields = this.getInfiniteFieldsQuery.data()?.pages.flatMap((page) => page?.content) || [];
    const players = this.getInfinitePlayersQuery.data()?.pages.flatMap((page) => page?.content) || [];
    const seasons = this.getInfiniteSeasonsQuery.data()?.pages.flatMap((page) => page?.content) || [];

    const newGameForm = this.clientStorage.get<GameForm>('new-game-form');
    if (!newGameForm) return;
    this.form.patchValue(newGameForm);

    if (newGameForm?.fieldId && !fields.some((field) => field?.fieldId === newGameForm.fieldId)) {
      this.form.patchValue({ fieldId: '' });
    }

    if (newGameForm?.seasonId && !seasons.some((season) => season?.id === newGameForm.seasonId)) {
      this.form.patchValue({ seasonId: '' });
    }

    if (newGameForm?.playersForFirstTeam) {
      const validFirstTeam = newGameForm.playersForFirstTeam
        .map((playerFromStorage) => players.find((p) => p?.playerId === playerFromStorage.playerId))
        .filter(Boolean) as Player[];
      this.form.controls.playersForFirstTeam.setValue(validFirstTeam);
    }

    if (newGameForm?.playersForSecondTeam) {
      const validSecondTeam = newGameForm.playersForSecondTeam
        .map((playerFromStorage) => players.find((p) => p?.playerId === playerFromStorage.playerId))
        .filter(Boolean) as Player[];
      this.form.controls.playersForSecondTeam.setValue(validSecondTeam);
    }
  });

  ngOnInit(): void {
    this.persistFormStateToStorage();
  }

  handleSubmit() {
    if (this.form.invalid) return this.form.markAllAsTouched();
    this.dialogRef.disableClose = true;
    const rawValues = this.form.getRawValue();
    rawValues.individualPrice = rawValues.individualPrice.replace(/\D/g, '').replace(/^0+/, '');
    const formattedDate = formatDate(rawValues.date, 'yyyy-MM-dd', 'en');

    const game: CreateGameRequest = {
      date: formattedDate,
      fieldId: rawValues.fieldId,
      individualPrice: Number(rawValues.individualPrice),
      seasonId: rawValues.seasonId,
    };

    const detail: CreateGameDetailRequest = {
      teams: [
        {
          members: this.detailsOfEachPlayerOfFirstTeam.controls.map((control) => ({
            playerId: control.get('player')?.value.playerId,
            goalsScored: control.get('goalsScored')?.value,
            ownGoals: control.get('ownGoals')?.value,
          })),
        },
        {
          members: this.detailsOfEachPlayerOfSecondTeam.controls.map((control) => ({
            playerId: control.get('player')?.value.playerId,
            goalsScored: control.get('goalsScored')?.value,
            ownGoals: control.get('ownGoals')?.value,
          })),
        },
      ],
    };

    this.createGameService.execute({ game, detail }).subscribe({
      next: () => {
        this.clientStorage.remove('new-game-form');
        this.dialogRef.close();
      },
      error: () => (this.dialogRef.disableClose = false),
    });
  }

  onPlayerToggle(event: MatOptionSelectionChange, player: Player, team: Team) {
    const detailsArray = this.getDetailsArray(team);
    if (event.source.selected) {
      detailsArray.push(
        this.formBuilder.group({
          player: [player, [Validators.required]],
          goalsScored: [0, [Validators.required]],
          ownGoals: [0, [Validators.required]],
        })
      );
    } else {
      detailsArray.controls.forEach((control, index) => {
        if (control.get('player')?.value.playerId === player.playerId) {
          detailsArray.removeAt(index);
        }
      });
    }
  }

  isPlayerAvailableFor(team: Team, player: Player): boolean {
    const control = this.getTeamControl(team);
    return !control.value.includes(player);
  }

  openNewSeasonDialog() {
    this.entityDialogService.openNewEntityDialog(NewSeasonDialogComponent, { entity: 'season' }).subscribe();
  }

  openNewFieldDialog() {
    this.entityDialogService.openNewEntityDialog(NewFieldDialogComponent, { entity: 'field' }).subscribe();
  }

  openNewPlayerDialog() {
    this.entityDialogService.openNewEntityDialog(NewPlayerDialogComponent, { entity: 'player' }).subscribe();
  }

  private getTeamControl(team: Team) {
    return team === Team.FIRST ? this.form.controls.playersForFirstTeam : this.form.controls.playersForSecondTeam;
  }

  private getDetailsArray(team: Team) {
    return team === Team.FIRST ? this.detailsOfEachPlayerOfFirstTeam : this.detailsOfEachPlayerOfSecondTeam;
  }

  private persistFormStateToStorage() {
    this.form.valueChanges.subscribe((values) => {
      const { individualPrice } = values;
      if (individualPrice) this.formatCurrency(individualPrice);
      this.clientStorage.set('new-game-form', values);
    });
  }

  private formatCurrency(value: string) {
    const formattedPrice = this.currencyPipe.transform(
      value.replace(/\D/g, '').replace(/^0+/, ''),
      'USD',
      'symbol',
      '1.0-0'
    );
    this.form.patchValue({ individualPrice: formattedPrice! }, { emitEvent: false });
  }

  get playersForFirstTeam() {
    return this.form.get('playersForFirstTeam')?.value || [];
  }

  get playersForSecondTeam() {
    return this.form.get('playersForSecondTeam')?.value || [];
  }

  get detailsOfEachPlayerOfFirstTeam() {
    return this.form.controls.detailsOfEachPlayerOfFirstTeam as FormArray;
  }

  get detailsOfEachPlayerOfSecondTeam() {
    return this.form.controls.detailsOfEachPlayerOfSecondTeam as FormArray;
  }

  TEAM = Team;
}

function teamsHaveSameLengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const first = control.get('playersForFirstTeam')?.value as any[];
    const second = control.get('playersForSecondTeam')?.value as any[];
    if (!first || !second) return null;
    return first.length === second.length ? null : { teamsNotSameLength: true };
  };
}
