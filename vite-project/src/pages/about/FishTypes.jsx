import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const FishTypes = () => {
  const koiTypes = [
    {
      name: "Kohaku",
      description: "A white-bodied koi with red markings. The name means 'red and white'. It's one of the most popular koi varieties.",
      image: "https://th.bing.com/th/id/OIP.nCeZfol3fJgzlAHUdLz_lgHaFQ?rs=1&pid=ImgDetMain"
    },
    {
      name: "Taisho Sanshoku (Sanke)",
      description: "A white-bodied koi with red and black markings. The name means 'three colors'.",
      image: "https://images.squarespace-cdn.com/content/v1/4f6c8d6ae4b08696a7443c8b/1501751531777-SP5Z8U8CVHSX3NZC54BP/image-asset.jpeg"
    },
    {
      name: "Showa Sanshoku",
      description: "A black-bodied koi with red and white markings. It's often confused with the Sanke.",
      image: "https://static.wixstatic.com/media/ce2aba_fe5f681cced04f45a02915baafee2f02~mv2.jpg/v1/fill/w_1000,h_778,al_c,q_85,usm_0.66_1.00_0.01/ce2aba_fe5f681cced04f45a02915baafee2f02~mv2.jpg"
    },
    {
      name: "Asagi",
      description: "A koi with a blue reticulated scale pattern on the top and red or orange on the sides.",
      image: "https://images.squarespace-cdn.com/content/v1/4f6c8d6ae4b08696a7443c8b/1381807329645-YPPD6YL0DHPWIU8YYBKS/Screen+shot+2013-10-13+at+11.46.45+AM.png"
    },
    {
      name: "Shusui",
      description: "A partially scaled variety of Asagi. It has a line of large scales down its back.",
      image: "https://th.bing.com/th/id/R.d77f99ea70a5963b404cb32a3e771836?rik=A1Vj9ePjrtYGWg&riu=http%3a%2f%2fwww.koiphen.com%2fforums%2fattachment.php%3fattachmentid%3d543253%26stc%3d1%26d%3d1453849247&ehk=Tr%2bjNQw0xUupgrRbleiTVP7y2ZdCb%2flV6waI3%2bBoWjY%3d&risl=&pid=ImgRaw&r=0"
    },
    {
      name: "Butterfly Koi",
      description: "Known for their long, flowing fins. They're a hybrid of traditional koi and Asian carp.",
      image: "https://th.bing.com/th/id/OIP.Uppgb0a3kLMV7Owxe39Y6gHaE7?rs=1&pid=ImgDetMain"
    }
  ];

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-5">KOI Fish Types</h1>
      <div className="row">
        {koiTypes.map((koi, index) => (
          <div key={index} className="col-md-4 mb-4">
            <div className="card h-100">
              <div className='ratio ratio-4x3'><img src={koi.image} className="card-img-top " alt={koi.name} /></div>
              <div className="card-body">
                <h5 className="card-title">{koi.name}</h5>
                <p className="card-text">{koi.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="cta-section">
        <h3>Need help ?</h3>
        <Link to="/booking#booking" className="cta-button">Schedule a Consultation</Link>
      </div>
    </div>
  );
};

export default FishTypes;
