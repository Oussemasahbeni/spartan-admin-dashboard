import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { faker } from '@faker-js/faker';
import { TranslocoModule } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMail, lucideTrash2 } from '@ng-icons/lucide';
import { ValidationErrors } from '@shared/components/validation-errors/validation-errors';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmSpinner } from '@spartan-ng/helm/spinner';

interface TeamMember {
  id: number;
  avatar: string;
  name: string;
  email: string;
  role: 'read' | 'write' | 'admin';
}

@Component({
  selector: 'adm-settings-team',
  templateUrl: './team.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HlmAvatarImports,
    HlmButtonImports,
    HlmFieldImports,
    HlmInputImports,
    HlmInputGroupImports,
    HlmSelectImports,
    BrnSelectImports,
    HlmSpinner,
    FormField,
    NgIcon,
    TranslocoModule,
    ValidationErrors,
  ],
  providers: [provideIcons({ lucideMail, lucideTrash2 })],
})
export class SettingsTeam {
  // ==========================================
  // State
  // ==========================================

  readonly isLoading = signal(false);

  readonly members = signal<TeamMember[]>([
    {
      id: 1,
      avatar: faker.image.avatar(),
      name: 'Dejesus Michael',
      email: 'dejesusmichael@mail.org',
      role: 'admin',
    },
    {
      id: 2,
      avatar: faker.image.avatar(),
      name: 'Mclaughlin Steele',
      email: 'mclaughlinsteele@mail.me',
      role: 'admin',
    },
    {
      id: 3,
      avatar: faker.image.avatar(),
      name: 'Laverne Dodson',
      email: 'lavernedodson@mail.ca',
      role: 'write',
    },
    {
      id: 4,
      avatar: faker.image.avatar(),
      name: 'Trudy Berg',
      email: 'trudyberg@mail.us',
      role: 'read',
    },
    {
      id: 5,
      avatar: faker.image.avatar(),
      name: 'Lamb Underwood',
      email: 'lambunderwood@mail.me',
      role: 'read',
    },
    {
      id: 6,
      avatar: faker.image.avatar(),
      name: 'Mcleod Wagner',
      email: 'mcleodwagner@mail.biz',
      role: 'read',
    },
    {
      id: 7,
      avatar: faker.image.avatar(),
      name: 'Shannon Kennedy',
      email: 'shannonkennedy@mail.ca',
      role: 'read',
    },
  ]);

  readonly roles = ['read', 'write', 'admin'];

  readonly addMemberModel = signal({
    email: '',
    role: 'read' as 'read' | 'write' | 'admin',
  });

  readonly addMemberForm = form(this.addMemberModel, (schema) => {
    required(schema.email);
  });

  // ==========================================
  // Public Methods
  // ==========================================

  onAddMember(event: Event): void {
    submit(this.addMemberForm, async () => {
      event.preventDefault();
      this.addMember();
    });
  }

  removeMember(memberId: number): void {
    this.members.update((members) => members.filter((member) => member.id !== memberId));
  }

  // ==========================================
  // Private Methods
  // ==========================================

  private addMember(): void {
    this.isLoading.set(true);
    // Simulate API call
    setTimeout(() => {
      const newMember: TeamMember = {
        id: this.members().length + 1,
        avatar: faker.image.avatar(),
        name: this.addMemberModel().email.split('@')[0],
        email: this.addMemberModel().email,
        role: this.addMemberModel().role,
      };
      this.members.update((members) => [...members, newMember]);
      this.addMemberModel.set({ email: '', role: 'read' });
      this.isLoading.set(false);
    }, 1500);
  }
}
