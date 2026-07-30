import { isPlatformBrowser } from '@angular/common';
import { booleanAttribute, Component, computed, ElementRef, inject, input, output, PLATFORM_ID, signal, viewChild } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { TranslocoModule } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideAppWindow,
  lucideArrowUp,
  lucideBrainCircuit,
  lucideChevronDown,
  lucideFile,
  lucideGlobe,
  lucideGraduationCap,
  lucideLightbulb,
  lucideMic,
  lucideMoreHorizontal,
  lucidePaperclip,
  lucidePencilRuler,
  lucidePlus,
  lucideSquareStop,
  lucideX,
} from '@ng-icons/lucide';
import { BytesPipe } from '@shared/pipes/bytes/bytes.pipe';
import { HlmAttachmentImports } from '@spartan-ng/helm/attachment';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';

@Component({
  selector: 'adm-assistant-input',
  imports: [
    HlmButtonImports,
    HlmDropdownMenuImports,
    HlmInputImports,
    HlmInputGroupImports,
    HlmAttachmentImports,
    NgIcon,
    TranslocoModule,
    FormField,
    BytesPipe,
  ],
  templateUrl: './assistant-input.html',
  providers: [
    provideIcons({
      lucideArrowUp,
      lucideMic,
      lucidePaperclip,
      lucideChevronDown,
      lucidePlus,
      lucideGlobe,
      lucideBrainCircuit,
      lucideLightbulb,
      lucideMoreHorizontal,
      lucideAppWindow,
      lucideGraduationCap,
      lucidePencilRuler,
      lucideSquareStop,
      lucideX,
      lucideFile
    }),
  ],
})
export class AssistantInput {

    private readonly platformId = inject(PLATFORM_ID);
  // ==========================================
  // View Children
  // ==========================================

  private readonly fileInputRef = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  // ==========================================
  // Inputs
  // ==========================================

  public readonly isLoading = input(false, { transform: booleanAttribute });
  public readonly isStreaming = input(false, { transform: booleanAttribute });
  public readonly suggestions = input<string[]>([]);

  // ==========================================
  // Outputs
  // ==========================================

  public readonly messageSend = output<string>();
  public readonly inputCleared = output<void>();
  public readonly streamingStopped = output<void>();

  // ==========================================
  // State
  // ==========================================

  protected readonly attachments = signal<File[]>([]);
  protected readonly models = signal<string[]>([
    'Claude Opus 4.5',
    'Claude Sonnet 4.5',
    'Claude Sonnet 4.0',
    'GPT-5.2',
    'GPT-3.5 Turbo',
    'Gemini 3.0 Pro',
  ]);
  protected readonly selectedModel = signal<string>(this.models()[0]);
  protected readonly hasAttachments = computed(() => this.attachments().length > 0);

  protected readonly enableWebSearch = signal(false);
  protected readonly enableReasoning = signal(false);
  protected readonly enableThinking = signal(false);

  protected readonly isRecording = signal(false);

  protected readonly canSend = computed(() => this.promptForm.prompt().value().trim().length > 0 || this.hasAttachments());

  protected readonly promptModel = signal({ prompt: '' });

  protected readonly promptForm = form(this.promptModel);

  // ==========================================
  // Public Methods
  // ==========================================

  toggleMic() {
    this.isRecording.set(!this.isRecording());
  }

  handleSend() {
    if (this.canSend()) {
      this.messageSend.emit(this.promptForm.prompt().value());
      this.promptForm.prompt().value.set('');
    }
  }

  handleStopStreaming() {
    this.streamingStopped.emit();
  }

  handleFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const files = Array.from(input.files);
      // Add to attachments
      this.attachments.update((current) => [...current, ...files]);
      // Reset input so same file can be selected again
      input.value = '';
    }
  }

  handleKeydown(event: KeyboardEvent): void {
    // Enter without Shift sends the message
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.handleSend();
    }
    // Escape clears the input
    if (event.key === 'Escape') {
      this.handleClear();
    }
  }

  triggerFileInput(): void {
    this.fileInputRef()?.nativeElement.click();
  }

  removeAttachment(fileToRemove: File): void {
    const updatedAttachments = this.attachments().filter((file) => file !== fileToRemove);
    this.attachments.set(updatedAttachments);
  }

  selectModel(model: string): void {
    this.selectedModel.set(model);
  }

  isImageFile(file: File): boolean {
    return file.type.startsWith('image/');
  }

  /** Get file preview URL for images */
  getFilePreviewUrl(file: File): string {
    if (isPlatformBrowser(this.platformId) && this.isImageFile(file)) {
      return URL.createObjectURL(file);
    }
    return '';
  }

  // ==========================================
  // Private Methods
  // ==========================================

  private handleClear(): void {
    this.promptForm.prompt().value.set('');
    this.inputCleared.emit();
  }
}
