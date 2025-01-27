import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { reducer as toastrReducer } from "react-redux-toastr";
import { globalSlice } from "../features/global/globalSlice";
import { knowlSlice } from "../features/knowl/knowlSlice";
import { navSlice } from "../features/nav/navSlice";
import { tocSlice } from "../features/toc/tocSlice";

export const store = configureStore({
    reducer: {
        knowl: knowlSlice.reducer,
        nav: navSlice.reducer,
        toc: tocSlice.reducer,
        global: globalSlice.reducer,
        // For popup notifications
        toastr: toastrReducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
