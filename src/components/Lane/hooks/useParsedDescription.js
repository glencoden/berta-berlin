import { useEffect, useState } from 'react';

export const useParsedDescription = (item) => {
    const [ parsedDescription, setParsedDescription ] = useState({
        titleRepeat: '',
        detail: '',
        rest: [],
    });

    useEffect(() => {
        if (!item) {
            return;
        }
        const split = item.description.split('\n\n');
        const titleStart = item.title.split('-')[0];
        const titleRepeat = split.splice(split.findIndex(part => part.split('-')[0] === titleStart), 1);
        const detail = split.shift();
        setParsedDescription({
            titleRepeat,
            detail,
            rest: split,
        });
    }, [ item ]);

    return parsedDescription;
};