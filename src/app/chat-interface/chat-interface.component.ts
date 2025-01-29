import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';


import { ChatapiService } from '../service/chatapi.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
   selector: 'app-chat-interface',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './chat-interface.component.html',
  styleUrl: './chat-interface.component.css',
  providers:[ChatapiService]
})
export class ChatInterfaceComponent implements AfterViewInit {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  
  messageControl = new FormControl('');
  messages: { content: string, isBot: boolean, loading?: boolean, error?: boolean }[] = [];
  isTyping = false;
  theme: 'light' | 'dark' = 'light';
  typingSubject = new Subject<boolean>();
  emojiPickerVisible = false;

  constructor(private apiService: ChatapiService) {
    this.typingSubject.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(typing => {
      this.isTyping = typing;
    });
  }

  ngAfterViewInit() {
    this.scrollToBottom();
    this.loadHistory();
  }

  private scrollToBottom() {
    setTimeout(() => {
      this.messagesContainer.nativeElement.scrollTop = 
        this.messagesContainer.nativeElement.scrollHeight;
    }, 100);
  }

  private loadHistory() {
    const history = localStorage.getItem('chatHistory');
    if (history) this.messages = JSON.parse(history);
  }

  private saveHistory() {
    localStorage.setItem('chatHistory', JSON.stringify(this.messages));
  }

  parseMarkdown(content: string) {
    return marked(emoji.emojify(content));
  }

  async sendMessage() {
    const message = this.messageControl.value?.trim();
    if (!message) return;

    const newMessage = { content: message, isBot: false };
    this.messages.push(newMessage);
    this.messageControl.reset();
    
    // Add temporary loading message
    const loadingMessage = { 
      content: '', 
      isBot: true, 
      loading: true 
    };
    this.messages.push(loadingMessage);
    
    try {
      this.typingSubject.next(true);
      const response = await this.apiService.sendMessage(message).toPromise();
      
      // Replace loading message with actual response
      const responseIndex = this.messages.indexOf(loadingMessage);
      this.messages[responseIndex] = {
        content: response.response,
        isBot: true,
        loading: false
      };
      
    } catch (error) {
      const errorIndex = this.messages.indexOf(loadingMessage);
      this.messages[errorIndex] = {
        content: 'Failed to get response. Click to retry.',
        isBot: true,
        error: true
      };
    } finally {
      this.typingSubject.next(false);
      this.saveHistory();
      this.scrollToBottom();
    }
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    document.body.classList.toggle('dark-theme');
  }

  toggleEmojiPicker() {
    this.emojiPickerVisible = !this.emojiPickerVisible;
  }

  addEmoji(emoji: string) {
    this.messageControl.setValue(this.messageControl.value + emoji);
  }

  regenerateResponse(message: any) {
    if (message.error) {
      message.loading = true;
      message.error = false;
      this.sendMessage();
    }
  }
}

function ViewChild(arg0: string): (target: ChatInterfaceComponent, propertyKey: "messagesContainer") => void {
  throw new Error('Function not implemented.');
}


function debounceTime(arg0: number): any {
  throw new Error('Function not implemented.');
}


function distinctUntilChanged(): any {
  throw new Error('Function not implemented.');
}


function marked(arg0: any) {
  throw new Error('Function not implemented.');
}
