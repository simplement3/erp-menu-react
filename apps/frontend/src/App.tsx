import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [menus, setMenus] = useState<any[]>([]);
  useEffect(() => {
    axios.get('http://localhost:3000/menu') // Ajusta puerto
      .then(res => setMenus(res.data))
      .catch(err => console.error(err));
  }, []);
  return (
    <div>
      <h1>Menús</h1>
      <ul>
        {menus.map(m => <li key={m.id}>{m.name} - ${m.price}</li>)}
      </ul>
    </div>
  );
}

export default App;