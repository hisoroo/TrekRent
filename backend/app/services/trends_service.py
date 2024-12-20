from sqlalchemy import func, distinct
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from ..models.rental import Rental
from ..models.equipment_type import EquipmentType
from ..models.equipment import Equipment

def get_rentals_timeline(db: Session, days: int = 7):
    end_date = datetime.now().date()
    start_date = end_date - timedelta(days=days)
    
    dates = [(start_date + timedelta(days=x)) for x in range(days+1)]
    
    rentals = db.query(
        func.date(Rental.created_at).label('date'),
        func.count(distinct(Rental.id)).label('count')
    ).filter(
        func.date(Rental.created_at) >= start_date,
        func.date(Rental.created_at) <= end_date
    ).group_by(
        func.date(Rental.created_at)
    ).all()
    
    rental_dict = {date: count for date, count in rentals}
    
    return [{"date": date.strftime("%Y-%m-%d"), "rentals": rental_dict.get(date, 0)} for date in dates]

def get_equipment_trends(db: Session, days: int = None):
    try:
        stock_levels = db.query(
            EquipmentType.name,
            func.count(Equipment.id).filter(Equipment.is_available == True).label('available'),
            func.count(Equipment.id).label('total')
        ).outerjoin(
            Equipment, Equipment.equipment_type_id == EquipmentType.id
        ).group_by(
            EquipmentType.id,
            EquipmentType.name
        ).all()
        
        stock_data = [
            {
                "name": name, 
                "available": available or 0,
                "total": total or 0
            }
            for name, available, total in stock_levels
        ]

        base_query = db.query(
            EquipmentType.name,
            func.count(distinct(Rental.id)).label('rentals')
        ).outerjoin(
            Equipment, Equipment.equipment_type_id == EquipmentType.id
        ).outerjoin(
            Rental, Rental.equipment_id == Equipment.id
        )

        if days:
            end_date = datetime.now().date()
            start_date = end_date - timedelta(days=days)
            base_query = base_query.filter(
                func.date(Rental.created_at) >= start_date,
                func.date(Rental.created_at) <= end_date
            )

        rental_counts = base_query.group_by(EquipmentType.name).all()
        
        total_rentals = sum(count for _, count in rental_counts)
        
        share_data = []
        if total_rentals > 0:
            share_data = [
                {
                    "name": name,
                    "value": round((count / total_rentals * 100), 2)
                }
                for name, count in rental_counts
                if count > 0
            ]
            
            share_data.sort(key=lambda x: x["value"], reverse=True)
            
            if len(share_data) > 5:
                top_5 = share_data[:5]
                others_value = sum(item["value"] for item in share_data[5:])
                if others_value > 0:
                    top_5.append({
                        "name": "Inne",
                        "value": round(others_value, 2)
                    })
                share_data = top_5

        return {
            "stock_levels": stock_data,
            "share": share_data
        }
    except Exception as e:
        print(f"Error in get_equipment_trends: {str(e)}")
        raise
