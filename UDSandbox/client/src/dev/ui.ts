let isOpen = false;
let notify: HTMLDivElement | null = null;

export function NotifyUI(title: string, message: string, duration: number) {
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
        notify.style.backgroundColor = '#f0f0f0';
        notify.style.padding = '5px 10px';
        notify.style.borderRadius = '10px';
        notify.style.transition = 'opacity 0.5s';
        notify.style.fontSize = '12px';
        notify.style.width = 'auto';
        notify.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        document.body.appendChild(notify);

        setTimeout(() => {
            if (notify) {
                notify.style.opacity = '0';
                setTimeout(() => {
                    if (notify) {
                        document.body.removeChild(notify);
                        notify = null;
                        isOpen = false;
                    }
                }, 500);
            }
        }, duration);
    } else {
        if (notify) {
            document.body.removeChild(notify);
            notify = null;
        }
    }
    isOpen = !isOpen;
}