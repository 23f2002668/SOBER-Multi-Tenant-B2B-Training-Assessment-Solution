import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-logo',
  template: `
    <div class="flex items-center space-x-4">
      <!-- Smiley Logo Container -->
      <div class="relative group">
        <!-- Background Glow -->
        <div class="absolute -inset-3 bg-gradient-to-r from-yellow-400/30 via-pink-500/20 to-purple-600/20 
                    rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
        
        <!-- Logo Circle -->
        <div class="relative w-14 h-14 rounded-full 
                    bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 
                    flex items-center justify-center shadow-xl 
                    overflow-hidden hover:scale-110 transition-transform duration-300 animate-pulse border-2 border-white">
          
          <!-- Happy Smiley Face -->
          <svg class="w-12 h-12 text-white" viewBox="0 0 100 100">
            <!-- Face Circle -->
            <circle cx="50" cy="50" r="45" fill="none" stroke="white" stroke-width="2" stroke-opacity="0.3" />
            
            <!-- Eyes - Blinking -->
            <g class="eyes">
              <!-- Left Eye -->
              <circle cx="35" cy="40" r="6" fill="white" class="eye-left">
                <animate attributeName="ry" values="6;1;6" dur="4s" repeatCount="indefinite" begin="0s" />
              </circle>
              
              <!-- Right Eye -->
              <circle cx="65" cy="40" r="6" fill="white" class="eye-right">
                <animate attributeName="ry" values="6;1;6" dur="4s" repeatCount="indefinite" begin="0.1s" />
              </circle>
            </g>
            
            <!-- Smiling Mouth -->
            <path d="M35,65 Q50,80 65,65" 
                  fill="none" stroke="white" stroke-width="4" stroke-linecap="round"
                  class="smile">
              <animate attributeName="d" 
                       values="M35,65 Q50,80 65,65;M35,65 Q50,75 65,65;M35,65 Q50,80 65,65" 
                       dur="3s" repeatCount="indefinite" />
            </path>
            
            <!-- Cheeks -->
            <g class="cheeks">
              <!-- Left Cheek -->
              <circle cx="25" cy="55" r="4" fill="rgba(255,255,255,0.2)" class="cheek-left">
                <animate attributeName="r" values="4;5;4" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.2;0.4;0.2" dur="2s" repeatCount="indefinite" />
              </circle>
              
              <!-- Right Cheek -->
              <circle cx="75" cy="55" r="4" fill="rgba(255,255,255,0.2)" class="cheek-right">
                <animate attributeName="r" values="4;5;4" dur="2s" repeatCount="indefinite" begin="0.5s" />
                <animate attributeName="opacity" values="0.2;0.4;0.2" dur="2s" repeatCount="indefinite" begin="0.5s" />
              </circle>
            </g>
            
            <!-- Sparkle Effects -->
            <g class="sparkles">
              <circle cx="20" cy="25" r="1.5" fill="white" opacity="0">
                <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
                <animate attributeName="r" values="1.5;2.5;1.5" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="80" cy="30" r="1.5" fill="white" opacity="0">
                <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" begin="0.7s" />
                <animate attributeName="r" values="1.5;2.5;1.5" dur="2s" repeatCount="indefinite" begin="0.7s" />
              </circle>
            </g>
          </svg>
          
          <!-- Face Shine Effect -->
          <div class="absolute top-1 left-1 w-4 h-4 rounded-full bg-white/30 blur-sm 
                      group-hover:scale-125 transition-transform duration-300"></div>
        </div>
        
        <!-- Floating Hearts on Hover -->
        <div class="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 
                    transition-all duration-300">
          <div class="text-pink-300 text-xs animate-bounce">
            ❤️
          </div>
        </div>
      </div>
      
      <!-- Brand Text -->
      <div>
        <h1 class="text-3xl font-extrabold 
                   bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300 
                   bg-clip-text text-transparent">
          SOBER
        </h1>
        <p class="text-sm text-white/80 font-medium">Multi-Tenant B2B Training & Assessment Solution</p>
      </div>
    </div>
  `,
  styles: [`
    .smile {
      animation: smile-wave 3s ease-in-out infinite;
    }
    
    @keyframes smile-wave {
      0%, 100% {
        d: path('M35,65 Q50,80 65,65');
      }
      50% {
        d: path('M35,65 Q50,75 65,65');
      }
    }
    
    .eyes circle {
      transform-origin: center center;
      animation: blink 4s infinite;
    }
    
    @keyframes blink {
      0%, 90%, 100% {
        transform: scaleY(1);
      }
      92%, 98% {
        transform: scaleY(0.1);
      }
    }
    
    .cheek-left {
      animation: cheek-pulse 2s ease-in-out infinite;
    }
    
    .cheek-right {
      animation: cheek-pulse 2s ease-in-out infinite 0.5s;
    }
    
    @keyframes cheek-pulse {
      0%, 100% {
        transform: scale(1);
        opacity: 0.2;
      }
      50% {
        transform: scale(1.2);
        opacity: 0.4;
      }
    }
  `]
})

export class LogoComponent {
  isHovered = false;

  @HostListener('mouseenter')
  onMouseEnter() {
    this.isHovered = true;
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.isHovered = false;
  }
}