import {
    Accessor,
    createEffect, createSignal,
    ParentProps,
    Setter,
    Show,
} from 'solid-js';
import { Portal } from 'solid-js/web';

declare namespace Popup {
    interface PopupProps extends ParentProps {
        visible: Accessor<boolean>,
        setVisible: Setter<boolean>,
        class?: string,
        mount?: Node,
    }
}

function Popup(props: Popup.PopupProps) {
    const [localVisible, setLocalVisible] = createSignal(false);
    const [animate, setAnimate] = createSignal('animate-fade-in');

    let popupRef!: HTMLDivElement;

    function onClick(e: MouseEvent) {
        if (!popupRef || !localVisible()) return;

        const clicked = e.target === popupRef || popupRef.contains(e.target as Node);
        if (!clicked) {
            props.setVisible(false);
        }
    }

    createEffect(() => {
        if (props.visible()) {
            document.addEventListener('click', onClick);
            setAnimate('animate-fade-in');
            setLocalVisible(true);
        } else {
            document.removeEventListener('click', onClick);
            setAnimate('animate-fade-out');
            setTimeout(() => {
                setLocalVisible(false);
            }, 150);
        }
    });

    return (
        <Show when={localVisible()}>
            <Portal mount={props.mount || document.body}>
                <div ref={popupRef} class={`absolute z-[1000] ${animate()} ${props.class || ''}`}>
                    {props.children}
                </div>
            </Portal>
        </Show>
    );
}

export default Popup;