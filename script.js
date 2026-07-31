document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.setAttribute('role', 'button');
        hamburger.setAttribute('tabindex', '0');
        hamburger.setAttribute('aria-label', 'Menüyü aç');
        hamburger.setAttribute('aria-expanded', 'false');

        const toggleMenu = () => {
            const isOpen = navLinks.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', String(isOpen));
            hamburger.setAttribute('aria-label', isOpen ? 'Menüyü kapat' : 'Menüyü aç');
        };

        hamburger.addEventListener('click', toggleMenu);
        hamburger.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                toggleMenu();
            }
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        const targetId = anchor.getAttribute('href');
        if (!targetId || targetId === '#') {
            return;
        }

        anchor.addEventListener('click', (event) => {
            const target = document.querySelector(targetId);
            if (target) {
                event.preventDefault();
                target.scrollIntoView({
                    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
                    block: 'start'
                });
            }
        });
    });

    const navbar = document.querySelector('.navbar');
    if (navbar) {
        const updateNavbarShadow = () => {
            navbar.style.boxShadow = window.scrollY > 50
                ? '0 4px 20px rgba(0,0,0,0.1)'
                : '0 2px 10px rgba(0,0,0,0.1)';
        };

        updateNavbarShadow();
        window.addEventListener('scroll', updateNavbarShadow, { passive: true });
    }

    const filterBtns = document.querySelectorAll('.filter-btn');
    const productItems = document.querySelectorAll('.product-item');

    filterBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            filterBtns.forEach((button) => button.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            productItems.forEach((item) => {
                item.style.display = filter === 'all' || item.getAttribute('data-category') === filter
                    ? 'grid'
                    : 'none';
            });
        });
    });

    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item) => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                faqItems.forEach((faqItem) => faqItem.classList.remove('active'));
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });

    const appointmentForm = document.getElementById('appointment-form');
    const appointmentList = document.getElementById('appointment-list');
    const clearAppointmentsBtn = document.getElementById('clear-appointments');

    if (appointmentForm && appointmentList) {
        const storageKey = 'havacAppointments';
        const feedback = document.getElementById('appointment-feedback');

        const getAppointments = () => {
            try {
                const raw = localStorage.getItem(storageKey);
                const parsed = raw ? JSON.parse(raw) : [];
                return Array.isArray(parsed) ? parsed : [];
            } catch (error) {
                return [];
            }
        };

        const saveAppointments = (appointments) => {
            localStorage.setItem(storageKey, JSON.stringify(appointments));
        };

        const formatDate = (dateText) => {
            const date = new Date(dateText);
            if (Number.isNaN(date.getTime())) {
                return dateText;
            }
            return date.toLocaleDateString('tr-TR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        };

        const statusClass = (status) => {
            if (status === 'Planlandi') {
                return 'status-planlandi';
            }
            if (status === 'Tamamlandi') {
                return 'status-tamamlandi';
            }
            return 'status-beklemede';
        };

        const renderAppointments = () => {
            const appointments = getAppointments();
            appointmentList.innerHTML = '';

            if (appointments.length === 0) {
                const empty = document.createElement('p');
                empty.className = 'appointment-empty';
                empty.textContent = 'Henüz kayıtlı randevu bulunmuyor.';
                appointmentList.appendChild(empty);
                return;
            }

            appointments.forEach((appointment) => {
                const card = document.createElement('article');
                card.className = 'appointment-card';

                const top = document.createElement('div');
                top.className = 'appointment-top';

                const title = document.createElement('h3');
                title.className = 'appointment-title';
                title.textContent = `${appointment.jobType} - ${appointment.productName}`;

                const badge = document.createElement('span');
                badge.className = `status-badge ${statusClass(appointment.status)}`;
                badge.textContent = appointment.status;

                top.appendChild(title);
                top.appendChild(badge);

                const meta = document.createElement('div');
                meta.className = 'appointment-meta';

                const customer = document.createElement('span');
                customer.textContent = `Musteri: ${appointment.customerName}`;

                const phone = document.createElement('span');
                phone.textContent = `Telefon: ${appointment.customerPhone}`;

                const date = document.createElement('span');
                date.textContent = `Tarih/Saat: ${formatDate(appointment.appointmentDate)} ${appointment.appointmentTime}`;

                const priority = document.createElement('span');
                priority.textContent = `Oncelik: ${appointment.priority}`;

                meta.appendChild(customer);
                meta.appendChild(phone);
                meta.appendChild(date);
                meta.appendChild(priority);

                const notes = document.createElement('p');
                notes.className = 'appointment-notes';
                notes.textContent = appointment.notes ? `Not: ${appointment.notes}` : 'Not: -';

                const actions = document.createElement('div');
                actions.className = 'appointment-actions';

                const planBtn = document.createElement('button');
                planBtn.type = 'button';
                planBtn.className = 'btn btn-sm btn-outline';
                planBtn.textContent = 'Planlandi';
                planBtn.dataset.action = 'plan';
                planBtn.dataset.id = appointment.id;

                const doneBtn = document.createElement('button');
                doneBtn.type = 'button';
                doneBtn.className = 'btn btn-sm btn-outline';
                doneBtn.textContent = 'Tamamlandi';
                doneBtn.dataset.action = 'done';
                doneBtn.dataset.id = appointment.id;

                const deleteBtn = document.createElement('button');
                deleteBtn.type = 'button';
                deleteBtn.className = 'btn btn-sm btn-outline';
                deleteBtn.textContent = 'Sil';
                deleteBtn.dataset.action = 'delete';
                deleteBtn.dataset.id = appointment.id;

                actions.appendChild(planBtn);
                actions.appendChild(doneBtn);
                actions.appendChild(deleteBtn);

                card.appendChild(top);
                card.appendChild(meta);
                card.appendChild(notes);
                card.appendChild(actions);

                appointmentList.appendChild(card);
            });
        };

        appointmentForm.addEventListener('submit', (event) => {
            event.preventDefault();

            if (!appointmentForm.checkValidity()) {
                appointmentForm.reportValidity();
                return;
            }

            const formData = new FormData(appointmentForm);
            const appointment = {
                id: String(Date.now()),
                customerName: String(formData.get('customerName') || '').trim(),
                customerPhone: String(formData.get('customerPhone') || '').trim(),
                jobType: String(formData.get('jobType') || '').trim(),
                productName: String(formData.get('productName') || '').trim(),
                appointmentDate: String(formData.get('appointmentDate') || '').trim(),
                appointmentTime: String(formData.get('appointmentTime') || '').trim(),
                priority: String(formData.get('priority') || 'Normal').trim(),
                notes: String(formData.get('notes') || '').trim(),
                status: 'Beklemede'
            };

            const appointments = getAppointments();
            appointments.unshift(appointment);
            saveAppointments(appointments);
            renderAppointments();

            appointmentForm.reset();
            if (feedback) {
                feedback.textContent = 'Randevu kaydedildi.';
            }
        });

        appointmentList.addEventListener('click', (event) => {
            const target = event.target;
            if (!(target instanceof HTMLElement)) {
                return;
            }

            const button = target.closest('button');
            if (!button) {
                return;
            }

            const id = button.dataset.id;
            const action = button.dataset.action;

            if (!id || !action) {
                return;
            }

            const appointments = getAppointments();
            const index = appointments.findIndex((item) => item.id === id);

            if (index === -1) {
                return;
            }

            if (action === 'plan') {
                appointments[index].status = 'Planlandi';
            } else if (action === 'done') {
                appointments[index].status = 'Tamamlandi';
            } else if (action === 'delete') {
                appointments.splice(index, 1);
            }

            saveAppointments(appointments);
            renderAppointments();
        });

        if (clearAppointmentsBtn) {
            clearAppointmentsBtn.addEventListener('click', () => {
                localStorage.removeItem(storageKey);
                renderAppointments();
                if (feedback) {
                    feedback.textContent = 'Tum randevular temizlendi.';
                }
            });
        }

        renderAppointments();
    }

    document.querySelectorAll('form').forEach((form) => {
        if (form.id === 'appointment-form') {
            return;
        }

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            alert('Mesajınız alındı! En kısa sürede size dönüş yapacağız.');
            form.reset();
        });
    });
});
