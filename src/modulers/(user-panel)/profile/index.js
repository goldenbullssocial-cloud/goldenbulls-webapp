import React from 'react'
import styles from './profile.module.scss';
import Input from '@/components/input';
import Button from '@/components/button';
const ProfileImage = '/assets/images/profile-upload.png';
const EditIcon = '/assets/icons/edit.svg';
export default function Profile() {
    return (
        <div className={styles.profilePage}>
            <div className={styles.title}>
                <h2>
                    Edit Profile
                </h2>
            </div>
            <div className={styles.profile}>
                <img src={ProfileImage} alt='ProfileImage' className={styles.img} />
                <div className={styles.editIcon}>
                    <img src={EditIcon} alt='EditIcon' />
                </div>
            </div>
            <div className={styles.profileInformation}>
                <div className={styles.twoCol}>
                    <Input label='First Name' placeholder='Steve' smallInput />
                    <Input label='Last Name' placeholder='Harrington' smallInput />
                    <Input label='Phone' placeholder='1234567890' smallInput />
                    <Input label='Email' placeholder='thehairharrington@gmail.com' smallInput />
                    <Input label='City' placeholder='Hawkins' smallInput />
                    <Input label='State' placeholder='Indiana' smallInput />
                    <Input label='Country' placeholder='United States' smallInput />
                    <Input label='Gender' placeholder='Gender' smallInput />
                </div>
                <div className={styles.saveButton}>
                    <Button text="Save"/>
                </div>
            </div>
        </div>
    )
}
