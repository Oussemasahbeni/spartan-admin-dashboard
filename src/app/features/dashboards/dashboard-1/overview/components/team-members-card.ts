import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { User } from '../../../../../shared/models/user';

@Component({
  selector: 'adm-team-members-card',
  imports: [HlmCardImports, HlmAvatarImports, HlmButtonImports, HlmIconImports, HlmDropdownMenuImports, TranslocoModule],
  providers: [
    provideIcons({
      lucideChevronDown,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section *transloco="let t; prefix: 'dashboard1.teamMembersCard'" hlmCard class="h-full">
      <header hlmCardHeader>
        <h1 hlmCardTitle class="text-base font-semibold">{{ t('title') }}</h1>
        <p hlmCardDescription>{{ t('description') }}</p>
      </header>
      <main hlmCardContent class="space-y-4">
        @for (member of members(); track member.email) {
          <div class="flex min-w-0 items-center justify-between gap-4">
            <div class="flex min-w-0 flex-1 items-center gap-3">
              <hlm-avatar>
                <img hlmAvatarImage [src]="member.avatar" [alt]="member.name" />
                <span hlmAvatarFallback>
                  {{ member.name.split(' ')[0].charAt(0) + member.name.split(' ')[1].charAt(0) }}
                </span>
              </hlm-avatar>
              <div class="flex min-w-0 flex-col">
                <span class="truncate text-sm font-medium">{{ member.name }}</span>
                <span class="text-muted-foreground truncate text-sm">{{ member.email }}</span>
              </div>
            </div>
            <button type="button" hlmBtn variant="outline" size="sm" [hlmDropdownMenuTrigger]="roleMenu">
              {{ t('roles.' + member.role) }}
              <ng-icon hlmIcon name="lucideChevronDown" size="sm" />
            </button>

            <!-- Role Dropdown Menu -->
            <ng-template #roleMenu>
              <hlm-dropdown-menu>
                <button type="button" hlmDropdownMenuItem>{{ t('roles.user') }}</button>
                <button type="button" hlmDropdownMenuItem>{{ t('roles.admin') }}</button>
                <button type="button" hlmDropdownMenuItem>{{ t('roles.manager') }}</button>
                <hlm-dropdown-menu-separator />
                <button type="button" hlmDropdownMenuItem class="text-destructive">{{ t('remove') }}</button>
              </hlm-dropdown-menu>
            </ng-template>
          </div>
        }
      </main>
    </section>
  `,
})
export class TeamMembersCard {
  // ==========================================
  // Inputs
  // ==========================================

  public readonly members = input.required<User[]>();
}
