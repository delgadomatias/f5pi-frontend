import { CurrencyPipe, formatDate } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionSelectionChange, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { AlertComponent } from '@common/components/alert/alert.component';
import { GenericDialogComponent } from '@common/components/generic-dialog/generic-dialog.component';
import { ClientStorageService } from '@common/services/client-storage.service.abstract';
import { getMutationErrorMessage } from '@common/utils/get-mutation-error-message';
import { FieldsService } from '@fields/fields.service';
import { GamesService } from '@games/games.service';
import { CreateGameDetailRequest } from '@games/interfaces/create-game-detail-request.interface';
import { CreateGameRequest } from '@games/interfaces/create-game-request.interface';
import { Player } from '@players/interfaces/player.interface';
import { PlayersService } from '@players/players.service';
import { SeasonsService } from '@seasons/seasons.service';

enum Team {
  FIRST = 'first',
  SECOND = 'second',
}

interface MemberControl {
  player: FormControl<Player>;
  goalsScored: FormControl<number>;
  ownGoals: FormControl<number>;
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
  styleUrl: './new-game-dialog.component.css',
  templateUrl: './new-game-dialog.component.html',
  providers: [provideNativeDateAdapter(), CurrencyPipe],
})
export class NewGameDialogComponent implements OnInit {
  currencyPipe = inject(CurrencyPipe);
  dialogRef = inject(MatDialogRef);
  fieldsService = inject(FieldsService);
  formBuilder = inject(NonNullableFormBuilder);
  gamesService = inject(GamesService);
  playersService = inject(PlayersService);
  seasonsService = inject(SeasonsService);
  clientStorage = inject(ClientStorageService);
  getFieldsQuery = this.fieldsService.createGetFieldsQuery();
  getPlayersQuery = this.playersService.createGetPlayersQuery();
  getSeasonsQuery = this.seasonsService.createGetSeasonsQuery();

  form = this.formBuilder.group({
    date: [new Date(), [Validators.required]],
    individualPrice: ['', [Validators.required]],
    fieldId: ['', [Validators.required]],
    seasonId: ['', [Validators.required]],
    playersForFirstTeam: [[] as Player[], [Validators.required]],
    detailsOfEachPlayerOfFirstTeam: this.formBuilder.array<MemberControl>([]),
    playersForSecondTeam: [[] as Player[], [Validators.required]],
    detailsOfEachPlayerOfSecondTeam: this.formBuilder.array<MemberControl>([]),
  }, {
    validators: [teamsHaveSameLengthValidator()],
  });

  ngOnInit(): void {
    this.restoreFromStorage();

    this.form.valueChanges.subscribe((values) => {
      const { individualPrice } = values;
      if (individualPrice) this.formatCurrency(individualPrice);
      const valuesWithoutPlayers = { ...values };
      delete valuesWithoutPlayers.playersForFirstTeam;
      delete valuesWithoutPlayers.playersForSecondTeam;
      delete valuesWithoutPlayers.detailsOfEachPlayerOfFirstTeam;
      delete valuesWithoutPlayers.detailsOfEachPlayerOfSecondTeam;
      this.clientStorage.set('new-game-form', valuesWithoutPlayers);
    });
  }

  handleSubmit() {
    if (this.form.invalid) return this.form.markAllAsTouched();
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

    this.gamesService.createGameMutation.mutate({ game, detail }, {
      onSuccess: () => {
        this.clientStorage.remove('new-game-form');
        this.dialogRef.close();
      }
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
      )
    } else {
      detailsArray.controls.forEach((control, index) => {
        if (control.get('player')?.value.playerId === player.playerId) {
          detailsArray.removeAt(index);
        }
      })
    }
  }

  isPlayerAvailableFor(team: Team, player: Player): boolean {
    const control = this.getTeamControl(team);
    return !control.value.includes(player);
  }

  getErrorMessage() {
    return getMutationErrorMessage(this.gamesService.createGameMutation);
  }

  private getTeamControl(team: Team) {
    return team === Team.FIRST
      ? this.form.controls.playersForFirstTeam
      : this.form.controls.playersForSecondTeam;
  }

  private getDetailsArray(team: Team) {
    return team === Team.FIRST
      ? this.detailsOfEachPlayerOfFirstTeam
      : this.detailsOfEachPlayerOfSecondTeam
  }

  private restoreFromStorage() {
    const saved = this.clientStorage.get<any>('new-game-form');
    if (saved) this.form.patchValue(saved);
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