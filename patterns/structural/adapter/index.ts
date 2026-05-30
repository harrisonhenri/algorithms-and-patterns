/**
 * Adapter — converts the interface of a class into another interface clients expect,
 * so classes that could not work together can collaborate (often wrapping a legacy or third-party API).
 *
 * @date 2026-05-10
 */

/** What the application expects when sending user-visible notifications. */
interface INotificationSender {
  send(message: string, userId: string): void;
}

/** Legacy Slack SDK-style API: posts raw text to a channel name. */
class SlackApi {
  public postToChannel(channel: string, text: string): void {
    console.log(`Slack #${channel}: ${text}`);
  }
}

/** Adapts SlackApi to INotificationSender. */
class SlackNotificationAdapter implements INotificationSender {
  constructor(
    private readonly slack: SlackApi,
    private readonly defaultChannel: string,
  ) {}

  public send(message: string, userId: string): void {
    this.slack.postToChannel(this.defaultChannel, `[user:${userId}] ${message}`);
  }
}

function notifyUser(sender: INotificationSender, message: string, userId: string): void {
  sender.send(message, userId);
}

const slack = new SlackApi();
const adapter = new SlackNotificationAdapter(slack, "engineering-alerts");

notifyUser(adapter, "Deployment finished successfully.", "u-42");
