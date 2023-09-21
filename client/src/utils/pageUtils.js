

const getBackgroundColor = (name) => {
    // Pick a color based on the first letter of the name
    const colors = [
        "#e53935", // Red
        "#d81b60", // Pink
        "#8e24aa", // Purple
        "#5e35b1", // Deep Purple
        "#3949ab", // Indigo
        "#1e88e5", // Blue
        "#039be5", // Light Blue
        "#00acc1", // Cyan
        "#00897b", // Teal
        "#43a047", // Green
        "#7cb342", // Light Green
        "#c0ca33", // Lime
        "#fdd835", // Yellow
        "#ffb300", // Amber
        "#fb8c00", // Orange
        "#f4511e", // Deep Orange
        "#6d4c41", // Brown
        "#757575", // Grey
        "#546e7a"  // Blue Grey
    ];
    const charCode = name.charCodeAt(0) - 65;
    const index = charCode >= 0 && charCode < colors.length ? charCode : charCode % colors.length;
    return colors[index];
};

const pageUtils = {
    getBackgroundColor,
}

export default pageUtils;