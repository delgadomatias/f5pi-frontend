import { CurrencyPipe, formatDate } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormArray, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { AlertComponent } from '@common/components/alert/alert.component';

import { GenericDialogComponent } from '@common/components/generic-dialog/generic-dialog.component';
import { ClientStorageService } from '@common/services/client-storage.service.abstract';
import { getMutationErrorMessage } from '@common/utils/get-mutation-error-message';
import { FieldsService } from '@fields/fields.service';
import { GamesService } from '@games/games.service';
import { CreateGameDetailRequest } from '@games/interfaces/create-game-detail-request.interface';
import { CreateGameRequest } from '@games/interfaces/create-game-request.interface';
import { Member } from '@games/interfaces/member.interface';
import { Player } from '@players/interfaces/player.interface';
import { PlayersService } from '@players/players.service';
import { SeasonsService } from '@seasons/seasons.service';

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
    date: [formatDate(new Date(), 'yyyy-MM-dd', 'en'), [Validators.required]],
    individualPrice: ['', [Validators.required]],
    fieldId: ['', [Validators.required]],
    seasonId: ['', [Validators.required]],
    playersForFirstTeam: [[] as Player[], [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
    detailsOfEachPlayerOfFirstTeam: this.formBuilder.array<Member[]>([]),
    playersForSecondTeam: [[] as Player[], [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
    detailsOfEachPlayerOfSecondTeam: this.formBuilder.array<Member[]>([]),
  });

  ngOnInit(): void {
    const saved = this.clientStorage.get<any>('new-game-form');
    if (saved) {
      try {
        this.form.patchValue(saved);
      } catch { }
    }

    this.form.valueChanges.subscribe((values) => {
      if (values.individualPrice) {
        const formattedPrice = this.currencyPipe.transform(
          values.individualPrice.replace(/\D/g, '').replace(/^0+/, ''),
          'USD',
          'symbol',
          '1.0-0'
        );
        this.form.patchValue({ individualPrice: formattedPrice! }, { emitEvent: false });
      }

      this.clientStorage.set('new-game-form', values);
    });
  }

  handleSubmit() {
    if (this.form.invalid) return this.form.markAllAsTouched();
    const rawValues = this.form.getRawValue();
    rawValues.individualPrice = rawValues.individualPrice.replace(/\D/g, '').replace(/^0+/, '');
    rawValues.date = formatDate(rawValues.date, 'yyyy-MM-dd', 'en');

    const game: CreateGameRequest = {
      date: rawValues.date,
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

  isPlayerAvailableForFirstTeam(player: Player): boolean {
    return !this.form.controls.playersForSecondTeam.value.includes(player);
  }

  onSelectionChangeForFirstTeam(event: MatSelectChange): void {
    const selectedValues = event.value as Player[];
    this.updateTeamPlayerDetails(selectedValues, this.detailsOfEachPlayerOfFirstTeam);
  }

  isPlayerAvailableForSecondTeam(player: Player): boolean {
    return !this.form.controls.playersForFirstTeam.value.includes(player);
  }

  onSelectionChangeForSecondTeam(event: MatSelectChange): void {
    const selectedValues = event.value as Player[];
    this.updateTeamPlayerDetails(selectedValues, this.detailsOfEachPlayerOfSecondTeam);
  }

  getErrorMessage() {
    return getMutationErrorMessage(this.gamesService.createGameMutation);
  }

  private updateTeamPlayerDetails(players: Player[], formArray: FormArray) {
    const groups = players.map((player) => {
      return this.formBuilder.group({
        player: [player, [Validators.required]],
        goalsScored: [0, [Validators.required, Validators.min(0)]],
        ownGoals: [0, [Validators.required, Validators.min(0)]],
      });
    });

    formArray.clear();
    groups.forEach((group) => formArray.push(group));
  }


  get detailsOfEachPlayerOfFirstTeam() {
    return this.form.controls.detailsOfEachPlayerOfFirstTeam as FormArray;
  }

  get detailsOfEachPlayerOfSecondTeam() {
    return this.form.controls.detailsOfEachPlayerOfSecondTeam as FormArray;
  }

  get playersForFirstTeam() {
    return this.form.get('playersForFirstTeam')?.value || ([] as Player[]);
  }

  get playersForSecondTeam() {
    return this.form.get('playersForSecondTeam')?.value || ([] as Player[]);
  }

  get filteredPlayersForFirstTeam() {
    return this.getPlayersQuery.query.data()?.content.filter((player) => {
      return !this.playersForSecondTeam.some((p) => p.playerId === player.playerId);
    });
  }

  get filteredPlayersForSecondTeam() {
    return this.getPlayersQuery.query.data()?.content.filter((player) => {
      return !this.playersForFirstTeam.some((p) => p.playerId === player.playerId);
    });
  }
}
