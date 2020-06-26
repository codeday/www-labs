import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { addNotification } from '../../utils/airtable';

export default async ({ body: { id, phone } }, res) => {
  const phoneNumber = parsePhoneNumberFromString(phone || '', 'US');

  if (!phoneNumber || !phoneNumber.isValid()) {
    return res.send({ error: `That doesn't look like a valid phone number. (Sadly, we don't support all countries.)` });
  }

  await addNotification(id, phoneNumber.formatInternational());
  return res.send({ ok: true });
}
