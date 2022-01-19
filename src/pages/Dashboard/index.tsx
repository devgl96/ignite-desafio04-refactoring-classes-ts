import { useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import { Food } from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

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
  }

  async function handleDeleteFood(id: number) {
    const { foods } = dashboardOptions;

    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setDashboardOptions({...dashboardOptions, foods: foodsFiltered });
  }

  function toggleModal() {
    const { modalOpen } = dashboardOptions;

    const changeModalOpen = !modalOpen;

    setDashboardOptions({...dashboardOptions, modalOpen: changeModalOpen});
  }

  function toggleEditModal() {
    const { editModalOpen } = dashboardOptions;

    const changeEditModalOpen = !editModalOpen;

    setDashboardOptions({...dashboardOptions, editModalOpen: changeEditModalOpen});
  }

  function handleEditFood(food: FoodProps) {
    setDashboardOptions({...dashboardOptions, editingFood: food, editModalOpen: true });
  }

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