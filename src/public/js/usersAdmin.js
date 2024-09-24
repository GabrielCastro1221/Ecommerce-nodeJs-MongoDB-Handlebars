const $ = document;
const display = $.querySelector("#users");

const getUsers = async () => {
    try {
        const res = await fetch("/api/users");
        const data = await res.json();
        return data.allUsers;
    } catch (error) {
        console.error("Error al obtener usuarios");
    }
}

const displayUsers = async () => {
    try {
        const payload = await getUsers();
        if (Array.isArray(payload)) {
            let displayData = payload.map((object) => {
                const { _id, first_name, last_name, email, age, role, last_connection } = object;
                return `
                    <tr>
                        <td>${_id}</td>
                        <td>${first_name}</td>
                        <td>${last_name}</td>
                        <td>${email}</td>
                        <td>${age}</td>
                        <td>${role}</td>
                        <td>${last_connection}</td>
                        <td>
                            <button type="submit" class="btn-card-ok" onclick="rolPremium('${String(_id)}')">Premium<button>
                            <button class="btn-card-danger" onclick="deleteUser('${String(_id)}')">Eliminar<button>
                        </td>
                    </tr>
                `});
            display.innerHTML = displayData;
        } else {
            console.error("los usuarios no estan almacenados en un array:", payload);
        }
    } catch (error) {
        console.error("Error al obtener los usuarios");
    }
}

function deleteUser(userId) {
    fetch(`/api/users/${userId}`, { method: 'DELETE' }).then(response => {
        if (!response.ok) {
            throw new Error('Error al eliminar el usuario');
        }
        location.reload();
    }).catch(error => { console.error('Error:', error) });
}

function rolPremium(userId) {
    fetch(`/api/users/premium/${userId}`, { method: 'PUT' }).then(response => {
        if (!response.ok) {
            throw new Error('Error al actualizar Rol');
        }
        location.reload();
    }).catch(error => { console.error('Error:', error) });
}

displayUsers();
