import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import Swal from 'sweetalert2';

export const VueSweetalert = VueSweetalert2;

export const WarmConfirmAsync = async (title: string, text: string) => {
    const { isConfirmed } = await Swal.fire({
        title,
        text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#229922', //green color
        cancelButtonColor: '#999999', // gray color
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        reverseButtons: true,
    });

    return isConfirmed;
};
