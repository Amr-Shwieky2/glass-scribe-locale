/**
 * Is the business open right now? Evaluated in Israel time from OPENING_HOURS,
 * so it gives the same answer on the server and in any visitor's browser.
 * (Public holidays aren't modelled.)
 */
import { OPENING_HOURS, BUSINESS_TIME_ZONE } from '@/data/contact';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

export function isBusinessOpen(at: Date = new Date()): boolean {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: BUSINESS_TIME_ZONE,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(at);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  const day = WEEKDAYS.indexOf(get('weekday'));
  const minutes = Number(get('hour')) * 60 + Number(get('minute'));

  return OPENING_HOURS.some((slot) => slot.days.includes(day) && minutes >= toMinutes(slot.open) && minutes < toMinutes(slot.close));
}
