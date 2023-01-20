import { useMemo, useState } from 'react'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { editorService } from '../../services/editorService';
import { useApplicationContext } from '../../context';
import { ApplicationActionType } from '../../context/ApplicationActionType';
import { TransitionType } from '../../enums/TransitionType';

const SEARCH_LABEL = 'search';

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
                <Button onClick={() => setSearchActive(true)}>
                    {SEARCH_LABEL}
                </Button>
            ) : (
                <Autocomplete
                    sx={{ width: 240, display: 'inline-block' }}
                    freeSolo
                    disableClearable
                    clearOnEscape
                    blurOnSelect
                    options={options}
                    onChange={(_event, value) => {
                        editorService.setInsertVideo(value.id);
                        dispatch({
                            type: ApplicationActionType.SET_CURRENT_TRANSITION,
                            payload: TransitionType.INSERT,
                        });
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