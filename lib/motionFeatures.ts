// framer-motion's animation engine, loaded on its own after the page renders (see SiteChrome's
// <LazyMotion>). The `m` components in the header and FAQ only carry a small renderer, so the
// first load no longer ships the whole library.
export { domAnimation as default } from 'framer-motion';
