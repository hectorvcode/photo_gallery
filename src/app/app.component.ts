import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { StatusBar } from '@capacitor/status-bar';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(private platform: Platform) {
    this.platform.ready().then(() => {
      this.configureStatusBar();
    });
  }

  private async configureStatusBar(): Promise<void> {
    // Only run on native platforms (iOS/Android)
    if (!Capacitor.isNativePlatform()) return;

    try {
      await StatusBar.setOverlaysWebView({ overlay: false });
      // Optionally set a background color to match your toolbar on Android
      // await StatusBar.setBackgroundColor({ color: '#121212' });
    } catch (err) {
      // No-op if plugin is unavailable
      // eslint-disable-next-line no-console
      console.warn('StatusBar config skipped:', err);
    }
  }
}
