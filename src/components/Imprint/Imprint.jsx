import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { getImprintText } from './helpers/getImprintText';
import { StyledImprint } from './styled-components/StyledImprint';


function Imprint({ open, onClose }) {
    return (
        <Modal
            open={open}
            onClose={onClose}
        >
            <StyledImprint>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Imprint
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    {getImprintText()}
                </Typography>
            </StyledImprint>
        </Modal>
    );
}

export default Imprint;