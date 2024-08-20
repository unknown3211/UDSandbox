import { Delay } from "../main/functions";
let ProgressbarOpen = false;
let progressbar: HTMLDivElement | null = null;

export function ProgressbarUI(title: string, message: string, duration: number) {
    if (!ProgressbarOpen) {
        progressbar = document.createElement('div');
        progressbar.style.position = 'fixed';
        progressbar.style.bottom = '20px';
        progressbar.style.left = '50%';
        progressbar.style.transform = 'translateX(-50%)';
        progressbar.style.width = '300px';
        progressbar.style.padding = '20px';
        progressbar.style.border = 'none';
        progressbar.style.borderRadius = '10px';
        progressbar.style.background = 'rgba(0, 0, 0, 0.7)';
        progressbar.style.backgroundImage = 'linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.9) 100%)';
        progressbar.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.5)';
        progressbar.style.fontSize = '16px';
        progressbar.style.textAlign = 'center';
        progressbar.style.zIndex = '1000';
        progressbar.style.transition = 'opacity 0.3s ease-in-out';
        progressbar.style.opacity = '0';
        progressbar.style.color = '#fff';
    
        const progressTitle = document.createElement('h2');
        progressTitle.innerText = title;
        progressTitle.style.marginBottom = '10px';
        progressTitle.style.fontSize = '18px';
        progressTitle.style.color = '#fff';
        progressbar.appendChild(progressTitle);
    
        const progressMessage = document.createElement('p');
        progressMessage.innerText = message;
        progressMessage.style.marginBottom = '20px';
        progressMessage.style.fontSize = '14px';
        progressMessage.style.color = '#ddd';
        progressbar.appendChild(progressMessage);
    
        const progressBarContainer = document.createElement('div');
        progressBarContainer.style.width = '100%';
        progressBarContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        progressBarContainer.style.borderRadius = '5px';
        progressBarContainer.style.overflow = 'hidden';
        progressBarContainer.style.marginBottom = '10px';
        progressbar.appendChild(progressBarContainer);
    
        const progressBar = document.createElement('div');
        progressBar.style.width = '0%';
        progressBar.style.height = '10px';
        progressBar.style.backgroundColor = '#4caf50';
        progressBar.style.transition = `width ${duration}ms linear`;
        progressBarContainer.appendChild(progressBar);
    
        document.body.appendChild(progressbar);
    
        requestAnimationFrame(() => {
            if (progressbar) {
                progressbar.style.opacity = '1';
            }
            progressBar.style.width = '100%';
        });
    
        ProgressbarOpen = true;
        Delay(duration).then(() => {
            if (progressbar) {
                progressbar.style.opacity = '0';
                setTimeout(() => {
                    if (progressbar) {
                        document.body.removeChild(progressbar);
                        progressbar = null;
                        ProgressbarOpen = false;
                    }
                }, 300); 
            }
        });
    }
}