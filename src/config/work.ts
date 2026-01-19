// Work page configuration - secret project sneak peek
import type { Mode } from '@/types/theme';

export const WORK_IMAGE_PATHS: Record<Mode, string> = {
  light: '/images/work/light.png',
  dark: '/images/work/dark.png',
};

export const WORK_BLUR_DATA: Record<Mode, string> = {
  light: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAACXBIWXMAAAsTAAALEwEAmpwYAAABN0lEQVR4nAXBW0vCUAAA4PPHepEkwuzeps553PWckUcydWOpsUts2KYjK/UlTYzMSMQEo54yCMKk+kl9H5iq8ZnGvJXguyl+unjhKT815a+u/PrysiqAiZac6HBaFl4N9OEefvnkOyCLgCw8vPRkMNDSnaLQKqCeil8sMj/PzVxyX0GjijB3JNDKQScr5jE6lfhOXn48wdcFURUZF8WGKgN8ROlSUkjzhIWNI3yrZ+oFpKTiWiJ6JW6AQIoY3FY2RROGthXusoiaumwg2oyFq/sroJYKOWzY4rYtnvYJ39bxnYlbecbjIvZBCPhcKJDX28fUjQZ7ZW5gwCdX6lnCRY45g5ugxq82SbRfio+s9MRmxyY9tJNdM91QWQfvgVZmravuPBjM2IHPTnxi7w5Nqm8kmkXKQ5F/znWPaQs+tgoAAAAASUVORK5CYII=',
  dark: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAACXBIWXMAAAsTAAALEwEAmpwYAAABK0lEQVR4nAXBXU+CUAAA0PsQIlygKSBe+eoCBmih3hUqKJilM7+aZombD02bT661Xnror3cO8Hmtxuk+q1UZhFlkQgNzDoZVC2KL1UCieR2DtPTOLSJtvdEz6hFy6wK2oGHDCngNwkk4i6J9GG5nneWORBvHvy+qGFZMVgbHZLhZHB+2f+n6N1uezsPRKfDSsmJfljUogY8oXo2zZPmTzL/fpoevycs57j67bk3RNEEGu2Zr0X4cJNkozd4Hq8/h9NBP580W0UxdkMAEW+M6eSTDERlMG9Em7O+j3po0uzrSeQHclUrdKzt2g9gLYtvrO9dPVadnqg1RUBka2Bz0ZdlHqqNUcFF2RPlGFt0Cb3F5lM8BRF+oNKXkKInOSywnQ15kGJ6iCjlKYeh/5yIzb1+1PSYAAAAASUVORK5CYII=',
};

// Work mode taglines - matches the style of monthly taglines
export const WORK_TAGLINES: Record<Mode, string> = {
  light: 'lips sealed, app revealed',
  dark: 'midnight grind, trades in mind',
};

// How long to show the work image before transitioning back (in milliseconds)
export const WORK_DISPLAY_DURATION = 10000;
