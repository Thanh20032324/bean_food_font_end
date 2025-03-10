import React, { useState ,useReducer, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, SafeAreaView, Platform, TouchableOpacity, Alert } from 'react-native';
import { useCart } from '../Component/CartContext'; // Import the useCart hook
import { useSelector  , useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { deleteproduct, updatecartproduct } from '../Redux/ActionAddtoCart';
import Toast from 'react-native-toast-message';
import { URL } from '../const/const';

const OrderScreen = ({ navigation, route }) => {
  const { state, dispatch } = useCart(); // Get the cart state and dispatch
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [dataUid, setDataUid] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [products , setProducts] = useState([]);


  const isFocused = useIsFocused();

  const dispathDeleteProductFromCart = useDispatch();


  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        const storedUserId = await AsyncStorage.getItem('_id');
        
        if (storedUsername && storedUserId) {
          
          // setIsLoggedIn(true);
          setCurrentUser({ username: storedUsername, _id: storedUserId });
          console.log("User name:", storedUsername);
          console.log("User ID:", storedUserId); // Log giá trị của userId
          // console.log("Is Logged In:", true);    // Log trạng thái đăng nhập là true
        } else {
          console.log("User ID:", storedUserId);
          // console.log("Is Logged In:", false);   // Log trạng thái đăng nhập là false
        }
        
      } catch (error) {
        console.error('Error retrieving stored data:', error);
      }
    };
    
    checkLoginStatus();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('_id'); // Thay 'key' bằng khóa lưu trữ của bạn
        if (storedData !== null) {
          const isLogin = await AsyncStorage.getItem('isLogin');
          if(isLogin==='true'){
            setIsLoggedIn(true)
          setDataUid(storedData);
          console.log("vào đây vào log" , dataUid)
          }
  
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData()
  }, []);



      
const updateItemByIdInAsyncStorage = async (key, idToUpdate, updatedData) => {
  try {
    // Lấy mảng từ AsyncStorage
    const jsonData = await AsyncStorage.getItem(key);
    if (jsonData) {
      let dataArray = JSON.parse(jsonData);

      // Tìm đối tượng dựa trên trường ID
      const index = dataArray.findIndex((item) => item.idproductcart === idToUpdate);

      if (index !== -1) {
        // Cập nhật thuộc tính của đối tượng
        dataArray[index] = { ...dataArray[index], ...updatedData };

        // Lưu lại mảng đã được chỉnh sửa vào AsyncStorage
        await AsyncStorage.setItem(key, JSON.stringify(dataArray));

        console.log('Object updated successfully');
      }
    }
  } catch (error) {
    console.log('Error updating object:', error);
  }
};
const fetchDataOder= async ()=>{

  const storedData = await AsyncStorage.getItem('_id');
  try {
    const response = await fetch(`${URL}api/order`)
    const jsonData = await response.json();
    const datafilter = jsonData.filter((obj , index)=>
       obj.userId === storedData
    )
    console.log("vào đây log data order data fillter" , datafilter)
    setProducts(datafilter)

  
  } catch (error) {
        console.log(error);
  }
}
 
useEffect(() => {
  if (isFocused) {
    // Gọi hàm tải dữ liệu tại đây
    fetchDataOder()
  }
}, [isFocused]);
  // useEffect(() => {
   
  // const getDataFromAsyncStorage = async (key, id) => {
  //   // try {
  //     // const jsonData = await AsyncStorage.getItem(key);
  //     // if (jsonData) {
  //     //   const dataArray = JSON.parse(jsonData);
  //     //   const filteredData = dataArray.filter((obj) => obj.idusser === id);
  //     //   setProducts(filteredData)

       
  //     // }

  //   // } catch (error) {
  //   //   console.log('Error retrieving data: ', error);
  //   // }
  // };
  // getDataFromAsyncStorage('products' , dataUid)
  // }, []);


  useEffect(()=>{ 
      calculateTotalPrice();

  },[products])
  useEffect(()=>{
  },[])

  // Function to calculate the total price
  const calculateTotalPrice = () => {
    let total = 0;
if(products && products.length>=0){
  products.forEach((product) => {
    total += (product.price * product.quantity);
  });


  
  setTotalPrice(total);
}
  };

  const checkout = () => {
    // Create an array of product details
    // console.log('Checkout', products);
    

    navigation.navigate('PayScreen', {
      products,dataUid
    });
  };
  const handleCheckoutPress = () => {
    if (products.length === 0) {
      Alert.alert(
        'Yêu Cầu',
        'Vui lòng thêm món vào giỏ hàng! Hãy đến của hàng để gọi món ngay thôi nào!',
        [
          { text: 'Home', onPress: () => navigation.navigate('Home') }, // Replace 'HomeScreen' with the actual home screen route name
          { text: 'Cancel', style: 'cancel' },
        ],
      );
    } else {
      checkout();
    }
  };
  const removeItemByIdFromAsyncStorage = async (key, idToRemove) => {
    try {
      // Lấy mảng từ AsyncStorage
      const jsonData = await AsyncStorage.getItem(key);
      if (jsonData) {
        let dataArray = JSON.parse(jsonData);
  
        // Tìm đối tượng dựa trên trường ID
        const index = dataArray.findIndex((item) => item.idproductcart === idToRemove);
  
        if (index !== -1) {
          // Xóa đối tượng khỏi mảng
          dataArray.splice(index, 1);
  
          // Lưu lại mảng đã được chỉnh sửa vào AsyncStorage
          await AsyncStorage.setItem(key, JSON.stringify(dataArray));
  
          console.log('Object removed successfully');
        }
      }
    } catch (error) {
      console.log('Error removing object:', error);
    }
  };
  //method delete product from order 
  const deleteOrder = async (orderId) => {
    try {
      const response = await fetch(`${URL}api/deleteorder/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data); 
        fetchDataOder()
      } else {
        const errorData = await response.json();
        console.error(errorData); // In thông báo lỗi từ API
      }
    } catch (error) {
      console.error(error); // In lỗi nếu có lỗi xảy ra
      // Xử lý lỗi
      // ...
    }
  };
  


  const deleteProduct = (product) => {
    Alert.alert(
      'Delete Product',
      'Do you want to remove this item from the cart?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            console.log(product._id)
            deleteOrder(product._id)

            calculateTotalPrice()
          },
        },
      ]
    );
  };

  /////update order
  const updateOrder = async (orderId, quantity) => {
    try {
      const response = await fetch(`${URL}api/updateorder/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity })
      });
  
      if (!response.ok) {
        throw new Error('Cập nhật đơn hàng không thành công');
      }
  
      const dataorderupdate = await response.json();
      return dataorderupdate;
    } catch (error) {
      console.error(error);
      // Xử lý lỗi tại đây
    }
  };

  const incrementQuantity =async (product , index) => {
    try {
      console.log("id cart product" , product._id);

      const quantityproducts = product.quantity ; 
      const dataupdate = quantityproducts+1;

      console.log("data update"  ,quantityproducts)
      const updatedOrder = await updateOrder(product._id, dataupdate);
      // Sử dụng updatedOrder trong ứng dụng của bạn
      console.log("data after update" ,updatedOrder);
      fetchDataOder()

    } catch (error) {
      console.error(error);
      // Xử lý lỗi tại đây
    }

 
 
 
   

   
    calculateTotalPrice();
  };

  const decrementQuantity = async (product) => {

      try {
        console.log("id cart product" , product._id);
  
        const quantityproducts = product.quantity ; 
      if(quantityproducts>1){
        const dataupdate = quantityproducts-1;
        console.log("data update"  ,quantityproducts)
        const updatedOrder = await updateOrder(product._id, dataupdate);
        // Sử dụng updatedOrder trong ứng dụng của bạn
        console.log("data after update" ,updatedOrder);
        fetchDataOder()
      }else{
        alert("số lượng phải lớn hơn 0")
      }
  
      
  
      } catch (error) {
        console.error(error);
        // Xử lý lỗi tại đây
      }
      calculateTotalPrice();
    
    
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('./../Image/logo_bean.png')} style={styles.logo} />
        <Text style={styles.title}>Order Food</Text>
      </View>
      {isLoggedIn ? (
        <>
          <Text style={styles.sectionTitle}>Selected Products:</Text>
          <ScrollView>
        {products&& products.length>0?(products.map((product, index) => (
          <View key={index} style={styles.productContainer}>
              <Image source={{ uri: product.image }} style={styles.productImage} />
              <View style={{ flexDirection: 'column', flex: 1 }}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productPrice}>{product.price * product.quantity} VND</Text>
              </View>
            <View style={styles.quantityContainer}>
              <TouchableOpacity onPress={() => decrementQuantity(product)}>
                <Text style={styles.quantityText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{product.quantity}</Text>
              <TouchableOpacity onPress={() => incrementQuantity(product , index)}>
                <Text style={styles.quantityText}>+</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.deleteButtonContainer}>
              <TouchableOpacity onPress={() => deleteProduct(product)}>
                <Image source={require('./../Image/delete-icon.png')} style={styles.icon} />
              </TouchableOpacity>
            </View>
          </View>
        ))):  Toast.show('This is a toast.')}
      </ScrollView>

          <View style={styles.bottomRow}>
            <Text style={styles.totalPrice}>Total: {totalPrice} VND</Text>
            <TouchableOpacity style={[styles.button, styles.bottomButton]} onPress={handleCheckoutPress}>
              <Text style={styles.buttonText}>Thanh toán</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        // If the user is not logged in, show this message instead
        <View style={styles.loginPrompt}>
          <Text style={styles.promptText}>
            Bạn vui lòng đăng nhập để gọi món!{' '}
            <Text style={styles.loginLink} onPress={() => navigation.navigate('LoginScreen')}>
              Đăng nhập ngay!
            </Text>
          </Text>
        </View>
      )}

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  logo: {
    width: 70,
    height: 50,
    marginRight: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 16,
  },
  productImage: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 10, // Add borderRadius for rounded corners
  },

  productContainer: {
    margin: 15,
    flexDirection: 'row',
    height: 90,
    alignItems: 'center',
    justifyContent: 'flex-start', // Adjust to align items horizontally
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 10,
  },

  productName: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#616161',
    alignSelf: 'center', // Align center with the image
  },

  productPrice: {
    color: '#319AB4',
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center', // Align center with the image
  },
  productContainer: {
    margin: 15,
    flexDirection: 'row',
    height: 90,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 10,
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#616161',
  },
  productPrice: {
    color: '#319AB4',
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalPrice: {
    fontSize: 18,
    padding: 10,
    fontWeight: 'bold',
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#319AB4',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    marginTop: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
  },
  bottomButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 18,
    paddingHorizontal: 8,
  },
  deleteButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default OrderScreen;
