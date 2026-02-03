// import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
// import { form, FormField, required, submit } from '@angular/forms/signals';
// import { TranslocoModule } from '@jsverse/transloco';
// import { NgIcon, provideIcons } from '@ng-icons/core';
// import { lucideMail, lucideTrash2 } from '@ng-icons/lucide';
// import { ValidationErrors } from '@shared/components/validation-errors/validation-errors';
// import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
// import { HlmButtonImports } from '@spartan-ng/helm/button';
// import { HlmFieldImports } from '@spartan-ng/helm/field';
// import { HlmInputImports } from '@spartan-ng/helm/input';
// import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
// import { HlmSelectImports } from '@spartan-ng/helm/select';
// import { HlmSpinner } from '@spartan-ng/helm/spinner';

// interface TeamMember {
//   id: number;
//   avatar: string;
//   name: string;
//   email: string;
//   role: 'read' | 'write' | 'admin';
// }

// interface Role {
//   label: string;
//   value: 'read' | 'write' | 'admin';
//   description: string;
// }

// @Component({
//   selector: 'adm-settings-team',
//   templateUrl: './team.component.html',
//   changeDetection: ChangeDetectionStrategy.OnPush,
//   imports: [
//     HlmAvatarImports,
//     HlmButtonImports,
//     HlmFieldImports,
//     HlmInputImports,
//     HlmInputGroupImports,
//     HlmSelectImports,
//     HlmSpinner,
//     FormField,
//     NgIcon,
//     TranslocoModule,
//     ValidationErrors,
//   ],
//   providers: [provideIcons({ lucideMail, lucideTrash2 })],
// })
// export class SettingsTeam {
//   // ==========================================
//   // State
//   // ==========================================

//   readonly isLoading = signal(false);

//   readonly members = signal<TeamMember[]>([
//     {
//       id: 1,
//       avatar: 'images/avatars/male-01.jpg',
//       name: 'Dejesus Michael',
//       email: 'dejesusmichael@mail.org',
//       role: 'admin',
//     },
//     {
//       id: 2,
//       avatar: 'images/avatars/male-03.jpg',
//       name: 'Mclaughlin Steele',
//       email: 'mclaughlinsteele@mail.me',
//       role: 'admin',
//     },
//     {
//       id: 3,
//       avatar: 'images/avatars/female-02.jpg',
//       name: 'Laverne Dodson',
//       email: 'lavernedodson@mail.ca',
//       role: 'write',
//     },
//     {
//       id: 4,
//       avatar: 'images/avatars/female-03.jpg',
//       name: 'Trudy Berg',
//       email: 'trudyberg@mail.us',
//       role: 'read',
//     },
//     {
//       id: 5,
//       avatar: 'images/avatars/male-07.jpg',
//       name: 'Lamb Underwood',
//       email: 'lambunderwood@mail.me',
//       role: 'read',
//     },
//     {
//       id: 6,
//       avatar: 'images/avatars/male-08.jpg',
//       name: 'Mcleod Wagner',
//       email: 'mcleodwagner@mail.biz',
//       role: 'read',
//     },
//     {
//       id: 7,
//       avatar: 'images/avatars/female-07.jpg',
//       name: 'Shannon Kennedy',
//       email: 'shannonkennedy@mail.ca',
//       role: 'read',
//     },
//   ]);

//   readonly roles: Role[] = [
//     {
//       label: 'Read',
//       value: 'read',
//       description: 'Can read and clone this repository. Can also open and comment on issues and pull requests.',
//     },
//     {
//       label: 'Write',
//       value: 'write',
//       description: 'Can read, clone, and push to this repository. Can also manage issues and pull requests.',
//     },
//     {
//       label: 'Admin',
//       value: 'admin',
//       description:
//         'Can read, clone, and push to this repository. Can also manage issues, pull requests, and repository settings, including adding collaborators.',
//     },
//   ];

//   readonly addMemberModel = signal({
//     email: '',
//     role: 'read' as 'read' | 'write' | 'admin',
//   });

//   readonly addMemberForm = form(this.addMemberModel, (schema) => {
//     required(schema.email);
//   });

//   // ==========================================
//   // Public Methods
//   // ==========================================

//   onAddMember(event: Event): void {
//     submit(this.addMemberForm, async () => {
//       event.preventDefault();
//       this.addMember();
//     });
//   }

//   updateMemberRole(memberId: number, newRole: 'read' | 'write' | 'admin'): void {
//     this.members.update((members) =>
//       members.map((member) => (member.id === memberId ? { ...member, role: newRole } : member))
//     );
//     console.log('Member role updated:', memberId, newRole);
//   }

//   removeMember(memberId: number): void {
//     this.members.update((members) => members.filter((member) => member.id !== memberId));
//     console.log('Member removed:', memberId);
//   }

//   trackByFn(index: number, item: TeamMember): number {
//     return item.id;
//   }

//   // ==========================================
//   // Private Methods
//   // ==========================================

//   private addMember(): void {
//     this.isLoading.set(true);
//     // Simulate API call
//     setTimeout(() => {
//       const newMember: TeamMember = {
//         id: this.members().length + 1,
//         avatar: 'images/avatars/male-01.jpg',
//         name: this.addMemberModel().email.split('@')[0],
//         email: this.addMemberModel().email,
//         role: this.addMemberModel().role,
//       };
//       this.members.update((members) => [...members, newMember]);
//       this.addMemberModel.set({ email: '', role: 'read' });
//       this.isLoading.set(false);
//     }, 1500);
//   }
// }
