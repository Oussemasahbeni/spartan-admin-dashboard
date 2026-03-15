import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
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
      avatar: 'https://avatars.githubusercontent.com/u/12345678',
      name: 'Dejesus Michael',
      email: 'dejesusmichael@mail.org',
      role: 'admin',
    },
    {
      id: 2,
      avatar: 'https://avatars.githubusercontent.com/u/23456789',
      name: 'Mclaughlin Steele',
      email: 'mclaughlinsteele@mail.me',
      role: 'admin',
    },
    {
      id: 3,
      avatar: 'https://avatars.githubusercontent.com/u/34567890',
      name: 'Laverne Dodson',
      email: 'lavernedodson@mail.ca',
      role: 'write',
    },
    {
      id: 4,
      avatar: 'https://avatars.githubusercontent.com/u/45678901',
      name: 'Trudy Berg',
      email: 'trudyberg@mail.us',
      role: 'read',
    },
    {
      id: 5,
      avatar: 'https://avatars.githubusercontent.com/u/56789012',
      name: 'Lamb Underwood',
      email: 'lambunderwood@mail.me',
      role: 'read',
    },
    {
      id: 6,
      avatar: 'https://avatars.githubusercontent.com/u/67890123',
      name: 'Mcleod Wagner',
      email: 'mcleodwagner@mail.biz',
      role: 'read',
    },
    {
      id: 7,
      avatar: 'https://avatars.githubusercontent.com/u/78901234',
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
    event.preventDefault();
    submit(this.addMemberForm, async () => {
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
        avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(this.addMemberModel().email)}`,
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
