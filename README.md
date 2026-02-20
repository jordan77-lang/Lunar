# Lunar Impact Simulator

## Impact Crater Physics

The simulation calculates crater dimensions based on the kinetic energy, mass, velocity, and impact angle of the projectile. The formulas used are derived from established planetary science scaling laws.

### 1. Crater Diameter

The diameter of the crater is calculated using a scaling law characteristic of the Holsapple-Schmidt Gravity Regime for non-porous targets. 

The formula used in the simulation is:

```
D = 0.158 * M^0.26 * V^0.44 * (sin(θ))^(1/3)
```

**Where:**
*   `D` = Transient Crater Diameter (in meters)
*   `M` = Mass of the projectile (in kg)
*   `V` = Impact velocity (in m/s)
*   `θ` (theta) = Impact angle (in degrees, where 90° is a vertical drop)

**Source / Derivation:**
*   The base formula originates from a scaling law provided in the project's legacy references (`java code.txt`): `D(km) = 1.58E-4 * M^0.26 * V(m/s)^0.44`
*   The exponent `0.26` (approximately `1/3.8`) is a standard recognized exponent for gravity-dominated cratering in rock/non-porous materials.
*   **Angle Factor:** An angular dependence factor of `(sin(θ))^(1/3)` is applied to scale the diameter based on the impact trajectory, representing standard energy coupling efficiency at oblique angles.

---

### 2. Crater Depth

Crater depth is estimated based on the calculated diameter, using empirical models defined by Pike (1977) for lunar craters. The calculation differs based on whether the crater is "simple" (bowl-shaped) or "complex" (having central peaks and terraced walls).

**Simple Craters (Diameter ≤ 15 km):**
```
d = 0.2 * D
```
*   The depth (`d`) is simply 20% of the diameter (`D`).

**Complex Craters (Diameter > 15 km):**
```
d_km = 1.04 * (D_km)^0.301
```
*   Where both depth (`d_km`) and diameter (`D_km`) are in kilometers.
*   The transition from simple to complex craters on the Moon typically occurs around 15 km in diameter, which this simulation uses as its threshold.

**Source:**
*   Pike, R. J. (1977). Size-dependence of shallow-water and other craters. _Impact and Explosion Cratering: Planetary and Terrestrial Implications_, 489-509.
