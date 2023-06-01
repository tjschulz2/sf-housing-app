'use client';
// Import required libraries
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css'; // Assuming you have a CSS module at this path
import { NextPage } from 'next';

const MyForm: NextPage = () => {
    const [roomPrice, setRoomPrice] = useState('');
    const [housemates, setHousemates] = useState('');
    const [contactMethod, setContactMethod] = useState('');
    const [link, setLink] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [description, setDescription] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    

    const handleOptionClick = (setOption: React.Dispatch<React.SetStateAction<string>>, value: string) => {
        setOption((prev: string) => prev === value ? '' : value);
    }

    const handleLinkClick = (e: React.MouseEvent) => {
        if (!isFormValid) {
            e.preventDefault();
        }
    }

    const handleInputChange = (setStateFunc: React.Dispatch<React.SetStateAction<string>>) => (event: React.ChangeEvent<HTMLInputElement>): void => {
        setStateFunc(event.target.value);
    }
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files.length > 0 ? event.target.files[0] : null;
      
        if (!file) return;
      
        setSelectedImage(file);
      
        const reader = new FileReader();
      
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
      
        reader.readAsDataURL(file);
      };
      

    useEffect(() => {
        if (description && roomPrice && housemates && contactMethod && link && email && (contactMethod !== 'phone' || phone)) {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    }, [description, roomPrice, housemates, contactMethod, link, email, phone, selectedImage, imagePreview]);


    return (
        <div className={styles.container}>
            <form className={styles.form}>
                <Link href="/directory/existing-communities">Back to directory</Link>
                <h1>Add community to the directory</h1>
                <div style={{ height: '1px', backgroundColor: 'gray', width: '100%' }} />
                
                <div>
                    <label>
                        <h2>What should your ideal housemate(s) be interested in doing?</h2>
                        <p className={styles.maxCharacters}>62 characters max</p>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ fontWeight: 'bold', marginRight: '5px', width: '35%' }}>Looking for people</span>
                            <input 
                                className={styles.inputStyle} 
                                type="text" 
                                placeholder="building early stage startups" 
                                maxLength={62}
                                onChange={handleInputChange(setDescription)}
                            />
                        </div>
                    </label>
                </div>

                <div>
                    <h2>How much does the average room cost?</h2>
                    <div className={styles.options} onClick={() => handleOptionClick(setRoomPrice, 'less1000')}>
                        <div className={`${styles.option} ${roomPrice === 'less1000' ? styles.optionSelected : ''}`}></div>
                        &lt;$1000 / month
                    </div>
                    <div className={styles.options} onClick={() => handleOptionClick(setRoomPrice, '1000to1500')}>
                        <div className={`${styles.option} ${roomPrice === '1000to1500' ? styles.optionSelected : ''}`}></div>
                        $1000 - $1500 / month
                    </div>
                    <div className={styles.options} onClick={() => handleOptionClick(setRoomPrice, '1500to2000')}>
                        <div className={`${styles.option} ${roomPrice === '1500to2000' ? styles.optionSelected : ''}`}></div>
                        $1500 - $2000 / month
                    </div>
                    <div className={styles.options} onClick={() => handleOptionClick(setRoomPrice, '2000to2500')}>
                        <div className={`${styles.option} ${roomPrice === '2000to2500' ? styles.optionSelected : ''}`}></div>
                        $2000 - $2500 / month
                    </div>
                    <div className={styles.options} onClick={() => handleOptionClick(setRoomPrice, '2500to3000')}>
                        <div className={`${styles.option} ${roomPrice === '2500to3000' ? styles.optionSelected : ''}`}></div>
                        $2500 - $3000 / month
                    </div>
                    <div className={styles.options} onClick={() => handleOptionClick(setRoomPrice, '3000plus')}>
                        <div className={`${styles.option} ${roomPrice === '3000plus' ? styles.optionSelected : ''}`}></div>
                        $3000+ / month
                    </div>
                </div>

                <div>
                    <h2>How many housemates do you live with?</h2>
                    <div className={styles.options} onClick={() => handleOptionClick(setHousemates, '1-2')}>
                        <div className={`${styles.option} ${housemates === '1-2' ? styles.optionSelected : ''}`}></div>
                        1-2
                    </div>
                    <div className={styles.options} onClick={() => handleOptionClick(setHousemates, '3-5')}>
                        <div className={`${styles.option} ${housemates === '3-5' ? styles.optionSelected : ''}`}></div>
                        3-5
                    </div>
                    <div className={styles.options} onClick={() => handleOptionClick(setHousemates, '6-12')}>
                        <div className={`${styles.option} ${housemates === '6-12' ? styles.optionSelected : ''}`}></div>
                        6-12
                    </div>
                    <div className={styles.options} onClick={() => handleOptionClick(setHousemates, '12+')}>
                        <div className={`${styles.option} ${housemates === '12+' ? styles.optionSelected : ''}`}></div>
                        12+
                    </div>
                </div>

                <div>
                    <label>
                        <h2>What&#39;s a link that best describes the community?</h2>
                        <p className={styles.maxCharacters}>Community website or Twitter page preferred. If none, then share a link that represents you</p>
                        <input className={styles.inputStyle} type="url" placeholder="mywebsite.io" onChange={handleInputChange(setLink)} />
                    </label>
                </div>

                <div>
                    <h2>Upload an image or logo of your community</h2>
                    <p className={styles.maxCharacters}>Optional. If you upload nothing, we will use your Twitter profile picture. JPG, JPEG, and PNG only.</p>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <input type="file" onChange={handleImageChange} />
                        {imagePreview && (
                            <img style={{ width: '100px', height: '100px', marginTop: '24px' }} src={imagePreview} alt="Image preview" />
                        )}
                    </div>
                </div>

                <div>
                    <label>
                        <h2>What&#39;s your email address?</h2>
                        <p className={styles.maxCharacters}>Well use this to contact you about new people looking for housing + communities.</p>
                        <input className={styles.inputStyle} type="email" placeholder="email@address.com" onChange={handleInputChange(setEmail)} />
                    </label>
                </div>
                
                <div>
                    <h2>How would you like people to contact you about housing?</h2>
                    <div className={styles.options} onClick={() => handleOptionClick(setContactMethod, 'phone')}>
                        <div className={`${styles.option} ${contactMethod === 'phone' ? styles.optionSelected : ''}`}></div>
                        Phone number
                    </div>
                    <div className={styles.options} onClick={() => handleOptionClick(setContactMethod, 'email')}>
                        <div className={`${styles.option} ${contactMethod === 'email' ? styles.optionSelected : ''}`}></div>
                        Email address (we will use the one you signed up with)
                    </div>
                    <div className={styles.options} onClick={() => handleOptionClick(setContactMethod, 'twitter')}>
                        <div className={`${styles.option} ${contactMethod === 'twitter' ? styles.optionSelected : ''}`}></div>
                        Twitter DMs (make sure your DMs are on)
                    </div>
                    <div className={styles.options} onClick={() => handleOptionClick(setContactMethod, 'website')}>
                        <div className={`${styles.option} ${contactMethod === 'website' ? styles.optionSelected : ''}`}></div>
                        Website form (ensure you put this down in the link above)
                    </div>

                    {contactMethod === 'phone' && 
                        <label>
                            <input className={styles.inputStyle} type="tel" placeholder="Phone number" onChange={handleInputChange(setPhone)} />
                        </label>
                    }
                </div>

                <Link className={`${styles.nextButton} ${isFormValid ? '' : styles.disabled}`} href={isFormValid ? "/next" : "#"} onClick={handleLinkClick}>
                    Next
                </Link>
            </form>
        </div>
    );
}

export default MyForm;