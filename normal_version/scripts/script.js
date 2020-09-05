// Modules
const Patches = require('Patches');
const Time = require('Time');

// Use export keyword to make a symbol available in scripting debug console
export const Diagnostics = require('Diagnostics');

(async function () {

    // Get data from patches
    const [rotation_speed, color_shift_speed, twist_speed] = await Promise.all([
        Patches.outputs.getScalar('rotation_speed'),
        Patches.outputs.getScalar('color_shift_speed'),
        Patches.outputs.getScalar('twist_speed')
    ]);

    // animation constants
    const fps = 30;
    const delay = Math.floor(1000 / fps);

    // animation variables
    var rotation_val = 0;
    var color_shift = 1;
    var twist_val = 0;

    // animation function
    Time.setIntervalWithSnapshot(
        {
            'rotation_speed': rotation_speed,
            'color_shift_speed': color_shift_speed,
            'twist_speed': twist_speed
        },
        function (time, snapshot) {
            rotation_val += snapshot.rotation_speed * delay / 1000;
            while (rotation_val < 0) {
                rotation_val += 180;
            }
            while (rotation_val >= 180) {
                rotation_val -= 180;
            }
            Patches.inputs.setScalar('rotation_pos', rotation_val);

            color_shift += snapshot.color_shift_speed * delay / 1000;
            while (color_shift < 1) {
                color_shift += 10;
            }
            while (color_shift >= 11) {
                color_shift -= 10;
            }
            Patches.inputs.setScalar('color_shift_pos', Math.floor(color_shift));

            twist_val += snapshot.twist_speed * delay / 1000;
            if (twist_val < -12) {
                twist_val = -12;
            } else if (twist_val > 12) {
                twist_val = 12;
            }
            Patches.inputs.setScalar('twist_val', twist_val);
        },
        delay);

})();
