import { useMemo, useState } from 'react';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { editorService } from '../../services/editorService';
import { useApplicationContext } from '../../context';
import { ApplicationActionType } from '../../context/ApplicationActionType';
import { TransitionType } from '../../enums/TransitionType';
import { isMobile } from "../../context/helpers/isMobile";

const SEARCH_LABEL = 'search';

const FILTER_OPTIONS = createFilterOptions({
    stringify: (option) => `${option.label} ${option.description}`,
});


function SimpleSearch() {
    const { dispatch } = useApplicationContext();

    const [ searchActive, setSearchActive ] = useState(false);

    const options = useMemo(() => {
        const completeVideoList = editorService.getAllVideos();
        return completeVideoList.map((entry) => ({
            label: entry.title,
            id: entry.id,
            description: entry.description,
        }));
    }, []);

    return (
        <>
            {!searchActive ? (
                <Button variant="" onClick={() => setSearchActive(true)}>
                    {SEARCH_LABEL}
                </Button>
            ) : (
                <Autocomplete
                    sx={{ width: isMobile() ? 180 : 240, display: 'inline-block' }}
                    size="small"
                    freeSolo
                    disableClearable
                    clearOnEscape
                    blurOnSelect
                    options={options}
                    filterOptions={FILTER_OPTIONS}
                    onChange={(_event, value) => {
                        editorService.setInsertVideo(value.id);
                        dispatch({
                            type: ApplicationActionType.SET_CURRENT_TRANSITION,
                            payload: TransitionType.INSERT,
                        });
                        if (isMobile()) {
                            dispatch({
                                type: ApplicationActionType.SET_MENU_OPEN,
                                payload: false,
                            });
                        }
                    }}
                    onBlur={() => {
                        setSearchActive(false);
                    }}
                    renderInput={(params) => <TextField {...params} label={SEARCH_LABEL} autoFocus />}
                />
            )}
        </>
    );
}

export default SimpleSearch;