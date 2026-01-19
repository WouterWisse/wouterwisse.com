// Work page configuration - secret project sneak peek
import type { Mode } from '@/types/theme';

export const WORK_IMAGE_PATHS: Record<Mode, string> = {
  light: '/images/work/light.png',
  dark: '/images/work/dark.png',
};

export const WORK_BLUR_DATA: Record<Mode, string> = {
  light: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAACXBIWXMAAAsTAAALEwEAmpwYAAABOklEQVR4nAXB20rCYAAA4P+JRKiLICgsTzuobbqtnO3wt/PUXLo0NU08LdEKsuYwybIuSoiiwCvfre8DSwV9g+F3GFzK4T8TWZnRT3F3Rm+OEz6P8IGlgi1gZC4GPzR8ZVPrCvNjIs+HW+O4//HADzyVHsGkIxATg/mtn6zb6tc562rkgMOGPApa8NgWOCPDNiD7Wpa+W9mXmj68sDpnRr+ggFKGVdIczfBqmr0tSLNq9qZs2qXiqalbugSaDG5RcUinjDTV0rl+Hl6ZgqXwuQyp0zjo0XsVImDT6KWQHOR4Jy90TbbG4ZXkdjG2AfoC1mQjXQ4ZSfE7jXRUsqclHTl2DUMOvwPaItYRokMYepDDnhZxTdSzSK9IeaXUxEqAgYzc61FXD031/akWmOeCi3NiUT96akC3Kv4DqSh/KRG1674AAAAASUVORK5CYII=',
  dark: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAACXBIWXMAAAsTAAALEwEAmpwYAAABLElEQVR4nAXBaU+CYAAA4Pcj6jBPFJRLVDAOlQT1DSQwJUBtJLo8osPNyq02v1Q/v+cBbYRWEEpGSDlRaacIOYmLSbyFEGKKlFAKDLKClmmqaW6Q5zyad+mGgdcuUUrKMHKOBb46dSTrRoA+r52gcTTMrWmPNWc6nLjwFiznsT9+8Ax/qVl/7vQn8L6iaB097zeHeHcAc+9xMr6f2kEI7bPr/i6C79Uq3h3il9Px8wycDhyKmi7pltJbQ/jumK+OswnCMNxv4w8AqbpC1FoE12+Kgdp9M3pPuro1Rwv7LpotAaS5Ns4IGKkQrMHV55Lgia2Zpnn963DkgCHDdiokXyg3ciUZK+sk2a2SKsVqFGOxHBgw1SuyyhdLpVS2mLgop4sFFMPSGIXm5Rz2DyfJPnGEvnIwAAAAAElFTkSuQmCC',
};

// How long to show the work image before transitioning back (in milliseconds)
export const WORK_DISPLAY_DURATION = 10000;
