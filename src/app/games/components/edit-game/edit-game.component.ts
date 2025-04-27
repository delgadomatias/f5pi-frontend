import { CurrencyPipe, formatDate } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { AlertComponent } from '@common/components/alert/alert.component';
import { GenericDialogComponent } from '@common/components/generic-dialog/generic-dialog.component';
import { getMutationErrorMessage } from '@common/utils/get-mutation-error-message';
import { GamesService } from '@games/games.service';
import { Game } from '@games/interfaces/game.interface';
import { UpdateGameRequest } from '@games/interfaces/update-game-request.interface';
import { injectUpdateGameMutation } from '@games/queries/inject-update-game-mutation';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GenericDialogComponent, AlertComponent, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatIconModule, MatDatepickerModule],
  selector: 'f5pi-edit-game',
  styleUrl: './edit-game.component.css',
  templateUrl: './edit-game.component.html',
  providers: [CurrencyPipe],
})
export class EditGameComponent implements OnInit {
  dialogRef = inject(MatDialogRef);
  formBuilder = inject(NonNullableFormBuilder);
  game = inject(MAT_DIALOG_DATA).game as Game;
  gamesService = inject(GamesService)
  currencyPipe = inject(CurrencyPipe);
  updateGameMutation = injectUpdateGameMutation();

  form = this.formBuilder.group({
    date: [this.parseLocalDate(this.game.date), [Validators.required]],
    individualPrice: [this.formatCurrency(this.game.individualPrice.toString()), [Validators.required, Validators.min(0)]],
  });

  ngOnInit(): void {
    this.form.valueChanges.subscribe((values) => {
      if (values.individualPrice) {
        const formattedPrice = this.formatCurrency(values.individualPrice);
        this.form.patchValue({ individualPrice: formattedPrice! }, { emitEvent: false });
      }
    });
  }

  handleSubmit() {
    if (this.form.invalid) return this.form.markAllAsTouched();
    const rawValues = this.form.getRawValue();
    const formattedDate = formatDate(rawValues.date, 'yyyy-MM-dd', 'en');
    const formattedPrice = rawValues.individualPrice!.replace(/\D/g, '').replace(/^0+/, '');
    const updateGameRequest: UpdateGameRequest = {
      ...rawValues,
      date: formattedDate,
      individualPrice: Number(formattedPrice),
    }

    this.updateGameMutation.mutate({
      gameId: this.game.gameId,
      request: updateGameRequest,
    }, { onSuccess: () => this.dialogRef.close() });
  }

  getErrorMessage() {
    return getMutationErrorMessage(this.updateGameMutation);
  }

  private parseLocalDate(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  private formatCurrency(value: string) {
    return this.currencyPipe.transform(
      value.replace(/\D/g, '').replace(/^0+/, ''),
      'USD',
      'symbol',
      '1.0-0'
    );
  }
}
