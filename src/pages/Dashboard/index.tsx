import { Component, useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

// class Dashboard extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       foods: [],
//       editingFood: {},
//       modalOpen: false,
//       editModalOpen: false,
//     }
//   }

//   async componentDidMount() {
//     const response = await api.get('/foods');

//     this.setState({ foods: response.data });
//   }

//   handleAddFood = async food => {
//     const { foods } = this.state;

//     try {
//       const response = await api.post('/foods', {
//         ...food,
//         available: true,
//       });

//       this.setState({ foods: [...foods, response.data] });
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   handleUpdateFood = async food => {
//     const { foods, editingFood } = this.state;

//     try {
//       const foodUpdated = await api.put(
//         `/foods/${editingFood.id}`,
//         { ...editingFood, ...food },
//       );

//       const foodsUpdated = foods.map(f =>
//         f.id !== foodUpdated.data.id ? f : foodUpdated.data,
//       );

//       this.setState({ foods: foodsUpdated });
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   handleDeleteFood = async id => {
//     const { foods } = this.state;

//     await api.delete(`/foods/${id}`);

//     const foodsFiltered = foods.filter(food => food.id !== id);

//     this.setState({ foods: foodsFiltered });
//   }

//   toggleModal = () => {
//     const { modalOpen } = this.state;

//     this.setState({ modalOpen: !modalOpen });
//   }

//   toggleEditModal = () => {
//     const { editModalOpen } = this.state;

//     this.setState({ editModalOpen: !editModalOpen });
//   }

//   handleEditFood = food => {
//     this.setState({ editingFood: food, editModalOpen: true });
//   }

//   render() {
//     const { modalOpen, editModalOpen, editingFood, foods } = this.state;

//     return (
//       <>
//         <Header openModal={this.toggleModal} />
//         <ModalAddFood
//           isOpen={modalOpen}
//           setIsOpen={this.toggleModal}
//           handleAddFood={this.handleAddFood}
//         />
//         <ModalEditFood
//           isOpen={editModalOpen}
//           setIsOpen={this.toggleEditModal}
//           editingFood={editingFood}
//           handleUpdateFood={this.handleUpdateFood}
//         />

//         <FoodsContainer data-testid="foods-list">
//           {foods &&
//             foods.map(food => (
//               <Food
//                 key={food.id}
//                 food={food}
//                 handleDelete={this.handleDeleteFood}
//                 handleEditFood={this.handleEditFood}
//               />
//             ))}
//         </FoodsContainer>
//       </>
//     );
//   }
// };

interface FoodProps {
  id: number;
  name: string;
  description: string;
  price: string;
  available: boolean;
  image: string;
};

interface DashboardProps {
  foods: FoodProps[];
  editingFood: FoodProps;
  modalOpen: boolean;
  editModalOpen: boolean;
};

export function Dashboard() {
  const [dashboardOptions, setDashboardOptions] = useState<DashboardProps>({
    foods: [],
    editingFood: {
      id: 0,
      name: "",
      description: "",
      price: "",
      available: true,
      image: "",
    },
    modalOpen: false,
    editModalOpen: false
  });

  useEffect(() => {
    api.get('/foods').then(response => {
      setDashboardOptions({
        ...dashboardOptions,
        foods: response.data,
      });
    });
  }, []);

  async function handleAddFood(food: FoodProps) {
    const {foods} = dashboardOptions;

    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      const newfoods = [...foods, response.data];

      setDashboardOptions({...dashboardOptions, foods: newfoods, modalOpen: false});
    } catch (err) {
      console.log(err);
    }

    console.log("handleAddFood");
  }

  async function handleUpdateFood(food: FoodProps) {
    const { foods, editingFood } = dashboardOptions;

    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setDashboardOptions({...dashboardOptions, foods: foodsUpdated, editModalOpen: false });
    } catch (err) {
      console.log(err);
    }

    console.log("handleUpdateFood");
  }

  async function handleDeleteFood(id: number) {
    const { foods } = dashboardOptions;

    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setDashboardOptions({...dashboardOptions, foods: foodsFiltered });

    console.log("handleDeleteFood");
  }

  function toggleModal() {
    const { modalOpen } = dashboardOptions;

    const changeModalOpen = !modalOpen;

    setDashboardOptions({...dashboardOptions, modalOpen: changeModalOpen});

    // this.setState({ modalOpen: !modalOpen });
    console.log("toggleModal");
  }

  function toggleEditModal() {
    const { editModalOpen } = dashboardOptions;

    const changeEditModalOpen = !editModalOpen;

    setDashboardOptions({...dashboardOptions, editModalOpen: changeEditModalOpen});

    // this.setState({ editModalOpen: !editModalOpen })
    console.log("toggleEditModal");
  }

  function handleEditFood(food: FoodProps) {
    setDashboardOptions({...dashboardOptions, editingFood: food, editModalOpen: true });

    console.log("handleEditFood");
  }

  console.log("dashboardOptions: ", dashboardOptions);

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={dashboardOptions.modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={dashboardOptions.editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={dashboardOptions.editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {dashboardOptions.foods &&
          dashboardOptions.foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}

export default Dashboard;