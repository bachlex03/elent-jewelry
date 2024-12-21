import { createSelector } from 'reselect';

export const selectAppLoading = createSelector(
    state => state.app.appLoading,
    appLoading => appLoading > 0,
);

export const selectActionLoading = type =>
    createSelector(
        state => state.app[type],
        loading => loading,
    );

export const selectAppTheme = createSelector(
    state => state.app.theme,
    theme => theme,
);

// export const selectAppLocale = createSelector(
//     state => state.app.locale,
//     locale => locale,
// );
// selectors/app.js
export const selectAppLocale = (state) => state.app.locale;


export const settingSystemSelector = createSelector(
    (state) => state.app.settingSystem,
    (settingSystem) => settingSystem,
);

export const selectedRowKeySelector = createSelector(
    (state) => state.app.selectedRowKey,
    (selectedRowKey) => selectedRowKey,
);
