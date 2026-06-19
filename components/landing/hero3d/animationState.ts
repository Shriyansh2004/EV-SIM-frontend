import { INITIAL_ANIMATION_STATE, type HeroAnimationState } from "./constants";

export const heroAnimationState: HeroAnimationState = { ...INITIAL_ANIMATION_STATE };

export function resetHeroAnimationState() {
  Object.assign(heroAnimationState, INITIAL_ANIMATION_STATE);
}
