/**
 * The inquiry email's images, bundled into the Worker (the "Data" rule in wrangler.toml imports
 * each PNG as an ArrayBuffer) and served at /email/<name>.png. Rebuild them with
 * scripts/build-email-assets.mjs.
 */
import logo from './email-assets/logo.png';
import swooshTop from './email-assets/swoosh-top.png';
import swooshBottom from './email-assets/swoosh-bottom.png';
import iconHospital from './email-assets/icon-hospital.png';
import iconUser from './email-assets/icon-user.png';
import iconMail from './email-assets/icon-mail.png';
import iconPhone from './email-assets/icon-phone.png';
import iconPin from './email-assets/icon-pin.png';
import iconBox from './email-assets/icon-box.png';
import iconGavel from './email-assets/icon-gavel.png';
import iconList from './email-assets/icon-list.png';
import iconBuilding from './email-assets/icon-building.png';
import iconClock from './email-assets/icon-clock.png';
import iconBadge from './email-assets/icon-badge.png';
import iconMessage from './email-assets/icon-message.png';
import iconInfo from './email-assets/icon-info.png';
import iconClip from './email-assets/icon-clip.png';

export const EMAIL_ASSETS = {
  'logo.png': logo,
  'swoosh-top.png': swooshTop,
  'swoosh-bottom.png': swooshBottom,
  'icon-hospital.png': iconHospital,
  'icon-user.png': iconUser,
  'icon-mail.png': iconMail,
  'icon-phone.png': iconPhone,
  'icon-pin.png': iconPin,
  'icon-box.png': iconBox,
  'icon-gavel.png': iconGavel,
  'icon-list.png': iconList,
  'icon-building.png': iconBuilding,
  'icon-clock.png': iconClock,
  'icon-badge.png': iconBadge,
  'icon-message.png': iconMessage,
  'icon-info.png': iconInfo,
  'icon-clip.png': iconClip,
};
