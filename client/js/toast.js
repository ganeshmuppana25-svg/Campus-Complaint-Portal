// =====================================
// Reusable SweetAlert2 Toast
// =====================================

const Toast = Swal.mixin({

    toast: true,

    position: "top-end",

    showConfirmButton: false,

    timer: 2500,

    timerProgressBar: true,

    didOpen: (toast) => {

        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);

    }

});

// =====================================
// Helper Function
// =====================================

function showToast(icon, title) {

    Toast.fire({

        icon: icon,

        title: title

    });

}