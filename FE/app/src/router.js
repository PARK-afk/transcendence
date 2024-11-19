'use strict';

export class Router {
    constructor(appElement) {
        this.routes = {};
        this.appElement = appElement;
    }

    addRoute(name, loader) {
        this.routes[name] = loader;
        console.log(`Route added: ${name}, ${this.routes[name]}`);
    }

    async loadView(viewName) {
        if (this.routes[viewName]) {
            try {
                const module = await this.routes[viewName]();
                this.appElement.innerHTML = module.render();
                if (typeof module.init === 'function') {
                    module.init(this);
                }
            } catch (error) {
                this.appElement.innerHTML = '<h1>Error loading page</h1>';
            }
        } else {
            this.appElement.innerHTML = '<h1>404 - Page Not Found</h1>';
        }
    }
    

    handlePopState() {
        const path = window.location.pathname.substring(1) || 'home';
        this.loadView(path);
    }

    navigate(path) {
        window.history.pushState({}, path, `/${path}`);
        this.loadView(path);
    }

    init() {
        window.addEventListener('popstate', () => this.handlePopState());

        const initialPath = window.location.pathname.substring(1) || 'home';
        this.loadView(initialPath);
    }
}
