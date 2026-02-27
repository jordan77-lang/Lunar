// ============================================================
// constants.js — Named constants for all magic numbers
//
// Having these in one place makes it easy to update physics
// parameters and understand where each number comes from.
// ============================================================

// --- Crater Scaling Law ---
// Holsapple-Schmidt (gravity regime, non-porous targets)
// D(m) = HOLSAPPLE_COEFF * M^HOLSAPPLE_MASS_EXP * V(m/s)^HOLSAPPLE_VEL_EXP * sin(θ)^(1/3)
export const HOLSAPPLE_COEFF    = 0.158;  // Pre-factor (dimensionally consistent, SI units)
export const HOLSAPPLE_MASS_EXP = 0.26;   // Mass exponent (~1/3.8, gravity regime)
export const HOLSAPPLE_VEL_EXP  = 0.44;   // Velocity exponent

// --- Crater Depth (Pike 1977) ---
// Simple craters  (D ≤ 15 km):  d = PIKE_SIMPLE_DEPTH_RATIO * D
// Complex craters (D > 15 km):  d_km = PIKE_COMPLEX_COEFF * D_km^PIKE_COMPLEX_EXP
export const PIKE_SIMPLE_DEPTH_RATIO  = 0.2;
export const PIKE_COMPLEX_COEFF       = 1.04;
export const PIKE_COMPLEX_EXP         = 0.301;
export const SIMPLE_COMPLEX_THRESHOLD_M = 15000; // 15 km — morphology boundary (meters)

// --- Crater Morphology (Moon.js) ---
// Bowl shape: parabolic depression, depth = CRATER_BOWL_DEPTH_RATIO * radius at center
export const CRATER_BOWL_DEPTH_RATIO  = 0.2;
// Complex crater threshold: craters with radius > this develop a central peak
export const COMPLEX_CRATER_RADIUS_M  = 7500;   // meters
// Central peak rises to CENTRAL_PEAK_RATIO * radius above the crater floor
export const CENTRAL_PEAK_RATIO       = 0.08;
// Ejecta blanket thickness decays as t(r) ∝ (r/R)^EJECTA_POWER_LAW_EXP
export const EJECTA_POWER_LAW_EXP     = -3.0;

// --- Planetary Surface Gravity ---
export const MOON_GRAVITY  = 1.62;  // m/s² (lunar surface)
export const EARTH_GRAVITY = 9.81;  // m/s² (terrestrial surface, standard gravity)

// --- Energy Conversion ---
// 1 megaton TNT ≈ 4.184 × 10¹⁵ joules
export const MEGATON_TNT_J = 4.184e15;

// --- Post-Processing Bloom (UnrealBloomPass) ---
// Only objects brighter than BLOOM_THRESHOLD are bloomed — keeps terrain dark, stars/ejecta glow
export const BLOOM_THRESHOLD = 0.8;
export const BLOOM_STRENGTH  = 0.6;
export const BLOOM_RADIUS    = 0.5;

// --- Starfield ---
// 18,000 color-varied stars with stellar type distribution (O/B/A/F/G/K/M)
export const STAR_COUNT = 18000;
