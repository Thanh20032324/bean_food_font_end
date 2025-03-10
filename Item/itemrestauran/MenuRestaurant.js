import { StyleSheet, Text, View, Dimensions , TouchableOpacity , ScrollView , Image } from "react-native";
import React , {useState , useEffect} from "react";

import { URL } from '../../const/const';
const { width, height } = Dimensions.get("window");
const MenuRestaurant = ({navigation , data }) => {
    const [datamenu , setdata] = useState([])


    useEffect(()=>{
      const fetchData = async () => {
        try {
          const response = await fetch(`${URL}api/product/getProductsInRestaurant/${data}`);
          const jsonData = await response.json();
            console.log("data restaurant", data._id);
            setdata(jsonData.data)

        } catch (error) {
          console.error(error);
        }
      };
  
      fetchData();

      console.log("data restau rant dffdsfd" , data);

   
     
    },[])
  return (
    <View style={styles.headermenu}>
      <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Menu</Text>
      </View>
      <ScrollView   showsVerticalScrollIndicator={false}>

      {
        datamenu.map((data , index)=><View style={{  marginTop:10,  width:0.92 *width , height:0.1*height , backgroundColor:'#F0F0F0' ,  borderWidth:1 , borderRadius:10}}>
        <View key={index} style = {{flexDirection:'row',alignItems:'center' ,  justifyContent:'space-between' }}>
         <Image  source={{uri:data.image}} style = {{ height:height*0.1   ,width:width*0.2 , borderTopLeftRadius:10 , borderBottomLeftRadius:10}} />
          <View style={{flexDirection:'column' }}>
            <Text style={{fontWeight:'bold',color:'#616161'}}>{data.name}</Text>
            <Text style={{  fontWeight:'bold' ,color:'#616161'}}>{data.realPrice}đ</Text>
          </View>
        
          <TouchableOpacity onPress ={()=>  navigation.navigate('ProductDetail', { product: data })} style={{width:0.06*width ,  height:0.03*height ,marginRight:10,  borderRadius:20 , backgroundColor:'#616161' , alignItems:'center' , justifyContent:'center'}}>
            <Text style={{color:'white' , fontWeight:'bold'}}>+</Text>
          </TouchableOpacity>
        </View>
        </View>)
      }
</ScrollView>
    </View>
  );
};

export default MenuRestaurant;

const styles = StyleSheet.create({
  headermenu: {
    top: 0.01 * height,
    margin: 15,
  },
});
