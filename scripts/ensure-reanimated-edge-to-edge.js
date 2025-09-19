const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const moduleName = 'react-native-is-edge-to-edge';
const rootModulePath = path.join(projectRoot, 'node_modules', moduleName);
const reanimatedModulePath = path.join(projectRoot, 'node_modules', 'react-native-reanimated');
const nestedModulePath = path.join(reanimatedModulePath, 'node_modules', moduleName);

function ensureEdgeToEdgeDependency() {
  if (!fs.existsSync(rootModulePath)) {
    console.warn(
      `[ensure-edge-to-edge] Skipping fix because ${moduleName} is not installed at ${rootModulePath}.`
    );
    return;
  }

  if (!fs.existsSync(reanimatedModulePath)) {
    console.warn(
      '[ensure-edge-to-edge] Skipping fix because react-native-reanimated is not installed.'
    );
    return;
  }

  if (fs.existsSync(nestedModulePath)) {
    return; // Nothing to do.
  }

  fs.mkdirSync(path.dirname(nestedModulePath), { recursive: true });

  try {
    fs.symlinkSync(rootModulePath, nestedModulePath, 'dir');
  } catch (linkError) {
    try {
      fs.cpSync(rootModulePath, nestedModulePath, { recursive: true });
    } catch (copyError) {
      console.warn('[ensure-edge-to-edge] Unable to symlink module:', linkError);
      console.warn('[ensure-edge-to-edge] Unable to copy module:', copyError);
      console.warn('[ensure-edge-to-edge] react-native-reanimated may still fail to resolve react-native-is-edge-to-edge.');
    }
  }
}

ensureEdgeToEdgeDependency();
