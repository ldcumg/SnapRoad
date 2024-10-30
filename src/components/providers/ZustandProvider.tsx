"use client";

import { createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import {
	type CounterState,
	type CounterStore,
	createCounterStore,
} from "@/store/counterStore";

export type CounterStoreApi = ReturnType<typeof createCounterStore>;

export const CounterStoreContext = createContext<CounterStoreApi | undefined>(
	undefined
);

export type CounterStoreProviderProps = React.PropsWithChildren<CounterState>;

export const CounterStoreProvider = ({
	children,
	...props
}: CounterStoreProviderProps) => {
	const storeRef = useRef<CounterStoreApi>();

	if (!storeRef.current) {
		storeRef.current = createCounterStore(props);
	}

	return (
		<CounterStoreContext.Provider value={storeRef.current}>
			{children}
		</CounterStoreContext.Provider>
	);
};

export const useCounterStore = <T,>(
	selector: (store: CounterStore) => T
): T => {
	const counterStoreContext = useContext(CounterStoreContext);

	if (!counterStoreContext) {
		throw new Error(`스토어가 비었습니다.`);
	}

	return useStore(counterStoreContext, selector);
};
