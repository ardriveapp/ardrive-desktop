import { initialize as initializeCoreHooks } from './coreHooks';
import { initialize as initializeNativeHooks } from './nativeHooks';

type CoreArguments = Parameters<typeof initializeCoreHooks>;
type NativeArguments = Parameters<typeof initializeNativeHooks>;

export const initializeHooks = (coreArgs: CoreArguments, nativeArgs: NativeArguments) => {
	initializeCoreHooks(...coreArgs);
	initializeNativeHooks(...nativeArgs);
};
