(function (global) {
  "use strict";

  const DEFAULTS = {
    endpoint: "/api/events",
    tagId: null,
    autoTrackClicks: true,
    clickAttr: "data-surface-event",
    storageKey: "_sf_visitor_id",
  };

  // ---------- helpers ----------
  const nowISO = () => new Date().toISOString();
  const isStr = (v) => typeof v === "string" && v.length > 0;

  function uuid() {
    // RFC4122-ish
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  function safeGet(k, fallback = null) {
    try {
      return localStorage.getItem(k) ?? fallback;
    } catch {
      return fallback;
    }
  }
  function safeSet(k, v) {
    try {
      localStorage.setItem(k, v);
    } catch {}
  }

  function getTagIdFromScript(scriptName) {
    const scripts = document.getElementsByTagName("script");
    for (let i = 0; i < scripts.length; i++) {
      const s = scripts[i];
      if (s.src && s.src.includes("/" + scriptName)) {
        try {
          return new URL(s.src, location.origin).searchParams.get("id");
        } catch {}
      }
    }
    return null;
  }

  function baseContext() {
    return {
      url: location.href,
      path: location.pathname,
      referrer: document.referrer || null,
      title: document.title || null,
      userAgent: navigator.userAgent || null,
      viewport: {
        w: document.documentElement?.clientWidth ?? null,
        h: document.documentElement?.clientHeight ?? null,
      },
      screen: {
        w: window.screen?.width ?? null,
        h: window.screen?.height ?? null,
      },
      ts: nowISO(),
    };
  }

  // ---------- class ----------
  class SurfaceAnalytics {
    /**
     * @param {Object} opts
     * @param {string} opts.endpoint - API endpoint to POST events (JSON)
     * @param {string} [opts.tagId]  - Project/site id (falls back to ?id= on script URL)
     * @param {boolean} [opts.autoTrackClicks=true] - Enable data-attribute click tracking
     */
    constructor(opts = {}) {
      this.opts = { ...DEFAULTS, ...opts };
      this.endpoint = this.opts.endpoint;
      this.tagId =
        this.opts.tagId || getTagIdFromScript("surface_analytics_lite.js");

      this.visitorId = safeGet(this.opts.storageKey) || this._rotateVisitorId();
      this.context = {}; // user-provided fields added to every event

      if (this.opts.autoTrackClicks) this._bindAutoClicks();
    }

    /** Identify the user. Persists visitorId as userId */
    identify(userId, traits = {}) {
      if (!isStr(userId))
        return console.warn("[SA-Lite] identify(userId) requires a string");
      if (this.visitorId !== userId) {
        this.visitorId = userId;
        safeSet(this.opts.storageKey, userId);
      }
      this._send("user_identified", userId, { traits });
    }

    /** Track a page view */
    page(name = document.title || null, props = {}) {
      this._send("page_view", name, props);
    }

    /** Track a custom event */
    track(eventName, props = {}) {
      if (!isStr(eventName))
        return console.warn("[SA-Lite] track(eventName) requires a string");
      this._send("custom_event", eventName, props);
    }

    /** Add/override context merged into every event */
    setContext(ctx = {}) {
      this.context = { ...this.context, ...(ctx || {}) };
    }

    // ---------- internals ----------
    _rotateVisitorId() {
      const id = uuid();
      safeSet(this.opts.storageKey, id);
      return id;
    }

    _envelope(type, name, meta) {
      return {
        tagId: this.tagId || null,
        visitorId: this.visitorId || null,
        eventType: type,
        eventName: name ?? undefined,
        metadata: {
          ...baseContext(),
          ...(this.context || {}),
          ...(meta || {}),
        },
      };
    }

    _canSend() {
      if (!isStr(this.endpoint)) {
        console.warn("[SA-Lite] Missing endpoint");
        return false;
      }
      if (!isStr(this.tagId)) {
        console.warn("[SA-Lite] Missing tagId (backend requires it)");
        return false;
      }
      if (!isStr(this.visitorId)) {
        console.warn("[SA-Lite] Missing visitorId");
        return false;
      }
      return true;
    }

    async _send(type, name, meta) {
      if (!this._canSend()) return;
      const payload = this._envelope(type, name, meta);
      try {
        await fetch(this.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          keepalive: true,
        });
      } catch (e) {
        console.warn("[SA-Lite] send failed", e);
      }
    }

    _bindAutoClicks() {
      const attr = this.opts.clickAttr;
      document.addEventListener(
        "click",
        (e) => {
          let t = e.target;
          while (t && t !== document.body) {
            if (t.hasAttribute && t.hasAttribute(attr)) {
              const name = t.getAttribute(attr) || "click";
              this.track(name, {
                elementId: t.id || null,
                tag: t.tagName || null,
                class: typeof t.className === "string" ? t.className : null,
                text: (t.innerText || "").slice(0, 100) || null,
              });
              break;
            }
            t = t.parentNode;
          }
        },
        true,
      );
    }
  }

  global.SurfaceAnalytics = SurfaceAnalytics;

  try {
    const scriptId = getTagIdFromScript("surface_analytics.js");
    global.surfaceAnalytics =
      global.surfaceAnalytics ||
      new SurfaceAnalytics({ tagId: scriptId || undefined });
  } catch {}
})(window);
