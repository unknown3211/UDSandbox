import { Delay } from "../main/functions";
let isOpen = false;
let notify: HTMLDivElement | null = null;

export type MessageType = 'error' | 'warning' | 'info' | 'success';

export function NotifyUI(title: string, message: string, duration: number, type: MessageType) {
    if (!isOpen) {
        notify = document.createElement('div');
        notify.innerHTML = `<span>${title}</span>`;
        const p = document.createElement('p');
        p.innerHTML = message;
        notify.appendChild(p);
        notify.style.position = 'fixed';
        notify.style.top = '10px';
        notify.style.left = '50%';
        notify.style.transform = 'translateX(-50%)';
        notify.style.display = 'flex';
        notify.style.flexDirection = 'column';
        notify.style.alignItems = 'center';
        notify.style.justifyContent = 'center';
        notify.style.padding = '5px 10px';
        notify.style.borderRadius = '10px';
        notify.style.transition = 'opacity 0.5s';
        notify.style.fontSize = '12px';
        notify.style.width = 'auto';
        notify.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';

        switch (type) {
            case 'error':
                notify.style.backgroundColor = '#f44336';
                break;
            case 'warning':
                notify.style.backgroundColor = '#ffae00';
                break;
            case 'info':
                notify.style.backgroundColor = '#4747ce';
                break;
            case 'success':
                notify.style.backgroundColor = '#4caf50';
                break;
        }

        document.body.appendChild(notify);

        Delay(duration).then(() => {
            if (notify) {
                notify.style.opacity = '0';
                Delay(500).then(() => {
                    if (notify) {
                        document.body.removeChild(notify);
                        notify = null;
                        isOpen = false;
                    }
                });
            }
        });
    } else {
        if (notify) {
            document.body.removeChild(notify);
            notify = null;
        }
    }
    isOpen = !isOpen;
}