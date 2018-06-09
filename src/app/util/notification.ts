export function notify(
  title: string,
  options: NotificationOptions = {},
  onClick?: (this: Notification, ev: Event) => any) {
  if (Notification && 'granted' !== Notification['permission']) {
    Notification.requestPermission()
  } else {
    const notification = new Notification(title, options)
    if (onclick) {
      notification.onclick = onClick
    }
  }
}
