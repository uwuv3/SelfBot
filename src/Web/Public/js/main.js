window.onload = (e) => tippy(document.querySelectorAll('.tippy'));
async function copyText() {
    let copyText = document.getElementById('copyText')
    try {
        await navigator.clipboard.writeText(copyText.getAttribute("data-copytext-text"));
        await copyText.setAttribute("data-tippy-content", "Copied Clipboard!")
        window.tippyInstances = [];
        const instances = tippy(document.querySelectorAll('.tippy'));
        window.tippyInstances = tippyInstances.concat(instances);
        tippyInstances.forEach(instance => {
            instance.destroy();
        });
        tippyInstances.length = 0; // clear it

        tippy(document.querySelectorAll('.tippy'), {
            trigger: 'focusin',
        });
    } catch {
        copyText.setAttribute("data-tippy-content", "Failed to Copy clipboard!")
        window.tippyInstances = [];
        const instances = tippy(document.querySelectorAll('.tippy'));
        window.tippyInstances = tippyInstances.concat(instances);
        tippyInstances.forEach(instance => {
            instance.destroy();
        });
        tippyInstances.length = 0; // clear it

        tippy(document.querySelectorAll('.tippy'), {
            trigger: 'focusin',
        });
    }
}
async function uncopyText() {
    let copyText = document.getElementById('copyText')
    copyText.setAttribute("data-tippy-content", "Copy to clipboard")
}

window.onmousemove = () => {
    window.tippyInstances = [];
    const instances = tippy(document.querySelectorAll('.tippy'));
    window.tippyInstances = tippyInstances.concat(instances);
    tippyInstances.forEach(instance => {
        instance.destroy();
    });
    tippyInstances.length = 0; // clear it

    tippy(document.querySelectorAll('.tippy'), {
        trigger: 'mouseenter focus',
    });
}