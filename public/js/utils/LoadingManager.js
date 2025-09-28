/**
 * Loading Manager utility for handling various loading states
 * Manages page, section, and button loading indicators
 */
export class LoadingManager {
    static showPageLoading() {
        document.getElementById('pageLoadingOverlay').style.display = 'flex';
    }

    static hidePageLoading() {
        document.getElementById('pageLoadingOverlay').style.display = 'none';
    }

    static showSectionLoading(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.add('section-loading');
        }
    }

    static hideSectionLoading(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.remove('section-loading');
        }
    }

    static showButtonLoading(buttonId) {
        const button = document.getElementById(buttonId);
        if (button) {
            const originalStyle = button.style.cssText;
            const originalClasses = button.className;
            button.dataset.originalStyle = originalStyle;
            button.dataset.originalClasses = originalClasses;
            
            button.classList.add('loading');
            button.disabled = true;
            
            const spinner = document.createElement('div');
            spinner.className = 'loading-spinner-beside';
            spinner.id = buttonId + '_spinner';
            button.parentNode.insertBefore(spinner, button.nextSibling);
        }
    }

    static hideButtonLoading(buttonId) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.classList.remove('loading');
            button.disabled = false;
            
            if (button.dataset.originalStyle !== undefined) {
                button.style.cssText = button.dataset.originalStyle;
                delete button.dataset.originalStyle;
            }
            
            if (button.dataset.originalClasses !== undefined) {
                delete button.dataset.originalClasses;
            }
            
            const spinner = document.getElementById(buttonId + '_spinner');
            if (spinner) {
                spinner.remove();
            }
        }
    }
}